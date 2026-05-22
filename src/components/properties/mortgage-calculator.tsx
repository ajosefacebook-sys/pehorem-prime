"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calculator, DollarSign, Percent, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface MortgageCalculatorProps {
  price: number
}

export function MortgageCalculator({ price }: MortgageCalculatorProps) {
  const [downPayment, setDownPayment] = useState(20)
  const [interestRate, setInterestRate] = useState(12)
  const [loanTerm, setLoanTerm] = useState(20)
  const [showResult, setShowResult] = useState(false)

  const loanAmount = price - (price * downPayment) / 100
  const monthlyRate = interestRate / 100 / 12
  const numberOfPayments = loanTerm * 12
  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / numberOfPayments
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

  const totalPayment = monthlyPayment * numberOfPayments
  const totalInterest = totalPayment - loanAmount

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-gold" />
        </div>
        <h3 className="text-lg font-display font-semibold text-white">Mortgage Calculator</h3>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Property Price</span>
            <span className="text-white font-medium">{formatCurrency(price)}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full gold-gradient rounded-full" style={{ width: "100%" }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Down Payment ({downPayment}%)</span>
            <span className="text-white font-medium">{formatCurrency((price * downPayment) / 100)}</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={downPayment}
            onChange={(e) => { setDownPayment(Number(e.target.value)); setShowResult(false) }}
            className="w-full accent-gold"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>5%</span>
            <span>50%</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Interest Rate ({interestRate}%)</span>
          </div>
          <input
            type="range"
            min="5"
            max="25"
            step="0.5"
            value={interestRate}
            onChange={(e) => { setInterestRate(Number(e.target.value)); setShowResult(false) }}
            className="w-full accent-gold"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>5%</span>
            <span>25%</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Loan Term ({loanTerm} years)</span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            value={loanTerm}
            onChange={(e) => { setLoanTerm(Number(e.target.value)); setShowResult(false) }}
            className="w-full accent-gold"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>5 years</span>
            <span>30 years</span>
          </div>
        </div>

        <Button variant="gold" size="lg" className="w-full" onClick={() => setShowResult(true)}>
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Mortgage
        </Button>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pt-4 border-t border-white/10 space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl p-4 text-center border border-white/5">
                <DollarSign className="w-5 h-5 text-gold mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{formatCurrency(Math.round(monthlyPayment))}</p>
                <p className="text-xs text-white/40">Monthly Payment</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center border border-white/5">
                <DollarSign className="w-5 h-5 text-gold mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{formatCurrency(Math.round(loanAmount))}</p>
                <p className="text-xs text-white/40">Loan Amount</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl p-4 text-center border border-white/5">
                <Percent className="w-5 h-5 text-gold mx-auto mb-2" />
                <p className="text-lg font-bold text-white">{formatCurrency(Math.round(totalInterest))}</p>
                <p className="text-xs text-white/40">Total Interest</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center border border-white/5">
                <Calendar className="w-5 h-5 text-gold mx-auto mb-2" />
                <p className="text-lg font-bold text-white">{loanTerm} years</p>
                <p className="text-xs text-white/40">Loan Term</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
