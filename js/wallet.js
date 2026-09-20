// js/wallet.js - Safe Simulated Digital Wallet & Payment Engine (Module 08)
// Safe campus project simulation - does not connect to real financial accounts

import { supabase, getCurrentUser, safeDbFetch, safeDbInsert } from './supabase.js'

const WALLET_KEY_PREFIX = 'ccm_wallet_'
const DEFAULT_INITIAL_BALANCE = 5000.00

/**
 * Generate a realistic simulated Transaction ID
 */
export function generateTransactionId(prefix = 'TXN') {
  const dateStr = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `${prefix}-${dateStr}-${randomStr}`
}

/**
 * Get user's wallet balance
 */
export async function getWalletBalance(userId) {
  if (!userId) {
    const user = await getCurrentUser()
    if (user) userId = user.id
  }
  if (!userId) return DEFAULT_INITIAL_BALANCE

  // 1. Try Supabase
  try {
    const { data } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single()
    if (data && data.balance !== undefined) {
      return Number(data.balance)
    }
  } catch (e) {}

  // 2. Fallback to localStorage
  const localVal = localStorage.getItem(`${WALLET_KEY_PREFIX}${userId}`)
  if (localVal !== null) {
    return parseFloat(localVal)
  }
  localStorage.setItem(`${WALLET_KEY_PREFIX}${userId}`, String(DEFAULT_INITIAL_BALANCE))
  return DEFAULT_INITIAL_BALANCE
}

/**
 * Add money simulation to wallet
 */
export async function addMoneyToWallet(amount, method = 'UPI') {
  const user = await getCurrentUser()
  if (!user) throw new Error('Please login to add money to wallet')

  const parsedAmount = parseFloat(amount)
  if (isNaN(parsedAmount) || parsedAmount <= 0) throw new Error('Please enter a valid amount')

  const currentBalance = await getWalletBalance(user.id)
  const newBalance = currentBalance + parsedAmount
  const txnId = generateTransactionId('TOPUP')

  // Save to Supabase or fallback
  try {
    await supabase.from('wallets').upsert({
      user_id: user.id,
      balance: newBalance,
      updated_at: new Date().toISOString()
    })
    await supabase.from('wallet_transactions').insert({
      user_id: user.id,
      type: 'credit',
      amount: parsedAmount,
      description: `Wallet Top-up via simulated ${method}`,
      reference_id: txnId
    })
  } catch (e) {
    // Local fallback
    localStorage.setItem(`${WALLET_KEY_PREFIX}${user.id}`, String(newBalance))
    const txns = JSON.parse(localStorage.getItem(`ccm_txns_${user.id}`) || '[]')
    txns.unshift({
      id: txnId,
      type: 'credit',
      amount: parsedAmount,
      description: `Wallet Top-up via simulated ${method}`,
      created_at: new Date().toISOString()
    })
    localStorage.setItem(`ccm_txns_${user.id}`, JSON.stringify(txns))
  }

  return { success: true, newBalance, txnId }
}

/**
 * Process simulated payment for checkout
 */
export async function processSimulatedPayment({ orderId, amount, method, paymentDetails = {} }) {
  const user = await getCurrentUser()
  const userId = user?.id || 'guest'
  const parsedAmount = parseFloat(amount)
  const txnId = generateTransactionId('PAY')

  if (method === 'wallet') {
    const currentBalance = await getWalletBalance(userId)
    if (currentBalance < parsedAmount) {
      throw new Error(`Insufficient wallet balance (Available: ₹${currentBalance}). Top up or select UPI / Cash.`)
    }
    const newBalance = currentBalance - parsedAmount

    // Deduct
    try {
      await supabase.from('wallets').upsert({
        user_id: userId,
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      await supabase.from('wallet_transactions').insert({
        user_id: userId,
        type: 'debit',
        amount: parsedAmount,
        description: `Payment for Order #${orderId?.substring(0, 8) || 'CAMPUS'}`,
        reference_id: txnId
      })
    } catch (e) {
      localStorage.setItem(`${WALLET_KEY_PREFIX}${userId}`, String(newBalance))
    }
  }

  // Record payment in payments table
  const paymentRecord = {
    order_id: orderId || null,
    user_id: userId,
    amount: parsedAmount,
    payment_method: method,
    transaction_id: txnId,
    status: 'success'
  }

  await safeDbInsert('payments', paymentRecord, () => supabase.from('payments').insert(paymentRecord))

  return {
    success: true,
    transactionId: txnId,
    amount: parsedAmount,
    method,
    status: 'success',
    timestamp: new Date().toISOString()
  }
}

/**
 * Process simulated refund
 */
export async function processSimulatedRefund(orderId, amount, userId) {
  const parsedAmount = parseFloat(amount)
  const currentBalance = await getWalletBalance(userId)
  const newBalance = currentBalance + parsedAmount
  const refundTxnId = generateTransactionId('REFUND')

  try {
    await supabase.from('wallets').upsert({
      user_id: userId,
      balance: newBalance,
      updated_at: new Date().toISOString()
    })
    await supabase.from('wallet_transactions').insert({
      user_id: userId,
      type: 'credit',
      amount: parsedAmount,
      description: `Refund for Cancelled Order #${orderId?.substring(0, 8)}`,
      reference_id: refundTxnId
    })
  } catch (e) {
    localStorage.setItem(`${WALLET_KEY_PREFIX}${userId}`, String(newBalance))
  }

  return { success: true, refundTxnId, newBalance }
}
