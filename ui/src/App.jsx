import { useState } from 'react'
import CategoryManager from './components/CategoryManager'
import ExpenseManager from './components/ExpenseManager'
import SalaryManager from './components/SalaryManager'
import MonthlyBalanceManager from './components/MonthlyBalanceManager'
import VisionAnalyzer from './components/VisionAnalyzer'

const TABS = [
  { id: 'expenses', label: 'Expenses' },
  { id: 'salary', label: 'Salary' },
  { id: 'monthly-balance', label: 'Monthly Balance' },
  { id: 'categories', label: 'Categories' },
  { id: 'vision', label: '🤖 Image AI' },
]

export default function App() {
  const [tab, setTab] = useState('expenses')

  return (
    <div>
      <header className="header">
        <div className="header-inner">
          <span className="logo">💰 Spend Management</span>
          <nav className="tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="main">
        {tab === 'expenses' && <ExpenseManager />}
        {tab === 'salary' && <SalaryManager />}
        {tab === 'monthly-balance' && <MonthlyBalanceManager />}
        {tab === 'categories' && <CategoryManager />}
        {tab === 'vision' && <VisionAnalyzer />}
      </main>
    </div>
  )
}
