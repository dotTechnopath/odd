import React, { Component } from 'react'
import Button from './Button'

const getRandomZipCode = location => {
	switch (location) {
		case 2:
			return ['98101', '02210', '94102', '11215', '30313'][
				Math.floor(Math.random() * 5)
			]
		case 1:
			return ['98006', '02030', '94010', '07102', '30306'][
				Math.floor(Math.random() * 5)
			]
		default:
			return ['98844', '02072', '94074', '07083', '30315'][
				Math.floor(Math.random() * 5)
			]
	}
}

const monthlyPaymentOfLoan = (APR, amountOwed) => {
	let n = 120 // 120 payments total
	let i = APR / 100 / 12
	let d = ((i + 1) ** n - 1) / (i * (i + 1) ** n)

	return amountOwed / d
}

const generateStoreOption = () => {
	// cost randomly between 5k and 20k
	// revenue randomly between 110% and 130% of the cost
	let cost = (Math.floor(Math.random() * 16) + 5) * 1000
	let revenue = Math.round(
		((Math.floor(Math.random() * 21) + 110) / 100) * cost
	)
	revenue = revenue - (revenue % 100)

	return { monthlyCost: cost, monthlyRevenue: revenue }
}

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			name: 'John Doe',
			balance: (Math.floor(Math.random() * 11) + 5) * 1000, // in dollars, random between 5k and 15k
			paymentDue: 0,
			loans: [
				/* { startTime, monthlyPayment, minDue } */
			],
			monthlyRevenue: 0,
			stores: [{ monthlyCost: 2000, monthlyIncome: 8000 }],
			creditReport: {
				onTimePayments: 0,
				missedPayments: 0,
				avgAge: 0, // loans.reduce((a, c) => a + (month - c.startTime), 0) / numberOfAccounts
				numberOfAccounts: 0 // loans.length
			},
			location: 0,
			month: 0, // time counter,
			storeOptions: [
				/* { monthlyCost, monthlyIncome } */
			]
		}
	}

	takeOutLoan = (APR, amountOwed) => {
		let newLoans = this.state.loans.slice().concat({
			startTime: this.state.month,
			monthlyPayment: monthlyPaymentOfLoan(APR, amountOwed),
			minDue: monthlyPaymentOfLoan(APR, amountOwed)
		})

		this.setState({ loans: newLoans })
	}

	buyStore = i => {
		// buys store indexed as i in the storeOptions array
		if (this.state.balance < this.state.storeOptions[i].monthlyCost) return

		let newBalance = this.state.balance - this.state.storeOptions[i].monthlyCost

		let newStoreOptions = this.state.storeOptions.slice()
		let newStores = this.state.stores
			.slice()
			.concat(newStoreOptions.splice(i, 1)[0])

		this.setState({
			balance: newBalance,
			storeOptions: newStoreOptions,
			stores: newStores
		})
	}

	nextMonth = () => {
		let newMonth = this.state.month + 1

		// generate 5 new store options
		let newStoreOptions = Array.from({ length: 5 }, () => generateStoreOption())

		// add monthlyRevenue to balance
		let newBalance = this.state.balance + this.state.monthlyRevenue

		// update credit report
		let newCreditReport = this.state.creditReport

		// update loans (if they're done)
		let newLoans = this.state.loans.slice()

		for (let i = newLoans.length - 1; i >= 0; i--) {
			if (newMonth - newLoans[i].startTime >= 10 && newLoans[i].minDue === 0) {
				newLoans.splice(i, 1)
			}
		}

		newLoans.forEach(l => {
			if (l.minDue > 0) newCreditReport.missedPayments++
			else newCreditReport.onTimePayments++

			l.minDue += l.monthlyPayment
		})

		// adjust paymentdue
		let newPaymentDue =
			this.state.stores.reduce((a, c) => a + c.monthlyCost, 0) +
			newLoans.reduce((a, c) => a + c.minDue, 0)

		// update credit report
		newCreditReport.numberOfAccounts = newLoans.length
		newCreditReport.avgAge =
			newLoans.reduce((a, c) => a + (newMonth - c.startTime), 0) /
			newCreditReport.numberOfAccounts

		this.setState({
			month: newMonth,
			storeOptions: newStoreOptions,
			balance: newBalance,
			creditReport: newCreditReport,
			loans: newLoans,
			paymentDue: newPaymentDue
		})
	}

	render() {
		return (
			<div className="App">
				<Button type="meme">text</Button>
			</div>
		)
	}
}

export default App
