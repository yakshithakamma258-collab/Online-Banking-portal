import React, { useState } from 'react';
import { 
  Landmark, 
  User, 
  Lock, 
  LogOut, 
  Plus, 
  Send, 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  CreditCard, 
  Info, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Loader2 
} from 'lucide-react';

// Interfaces for our state management
interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  email: string;
  maxLimit: number;
  createdAt: string;
}

interface Transfer {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  sourceAccount: string;
  type: 'IMPS' | 'NEFT' | 'RTGS';
  remark: string;
  timestamp: string;
  status: 'Initiated' | 'In Progress' | 'Success' | 'Failed';
  referenceNo: string;
}

interface UserProfile {
  name: string;
  email: string;
  username: string;
  balance: number;
  accountNo: string;
}

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('yakshitha');
  const [password, setPassword] = useState<string>('password');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Yakshitha',
    email: 'yakshitha@vitapbank.com',
    username: 'yakshitha',
    balance: 61371.25,
    accountNo: 'VITAP-9081-3214',
  });

  // Deposit State
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositSuccess, setDepositSuccess] = useState<string>('');
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<'balance' | 'deposit' | 'beneficiaries' | 'transfer' | 'history'>('balance');

  // Pre-seed some sample beneficiaries for a realistic student project
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

  const [newBeneName, setNewBeneName] = useState<string>('');
  const [newBeneAccNum, setNewBeneAccNum] = useState<string>('');
  const [newBeneBank, setNewBeneBank] = useState<string>('');
  const [newBeneEmail, setNewBeneEmail] = useState<string>('');
  const [newBeneLimit, setNewBeneLimit] = useState<string>('15000');
  const [beneError, setBeneError] = useState<string>('');
  const [beneSuccess, setBeneSuccess] = useState<string>('');

  // Funds Transfer States
  const [selectedBeneId, setSelectedBeneId] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [transferType, setTransferType] = useState<'IMPS' | 'NEFT' | 'RTGS'>('IMPS');
  const [transferRemark, setTransferRemark] = useState<string>('');
  const [transferError, setTransferError] = useState<string>('');

  // Empty transaction history to let user simulate everything from scratch
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  // Funds Transfer Simulation / Status States
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0); // 0: Handshake, 1: Checking Limits, 2: Clearing Settlement, 3: Completed
  const [simulatedTxn, setSimulatedTxn] = useState<Transfer | null>(null);

  // Search terms
  const [searchBene, setSearchBene] = useState<string>('');
  const [searchTxn, setSearchTxn] = useState<string>('');

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    setTimeout(() => {
      if (username.trim().toLowerCase() === 'yakshitha' && password === 'password') {
        setUserProfile({
          name: 'Yakshitha',
          email: 'yakshitha@vitapbank.com',
          username: 'yakshitha',
          balance: 61371.25,
          accountNo: 'VITAP-9081-3214',
        });
        setIsLoggedIn(true);
      } else if (username.trim() && password) {
        // Dynamic logins are also allowed for flexibility
        setUserProfile({
          name: username.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          email: `${username.toLowerCase()}@vitapbank.com`,
          username: username.toLowerCase(),
          balance: 20000.00,
          accountNo: 'VITAP-9081-3214',
        });
        setIsLoggedIn(true);
      } else {
        setLoginError('Please enter a valid username and password.');
      }
      setIsLoggingIn(false);
    }, 800);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('balance');
    setTransferAmount('');
    setSelectedBeneId('');
    setTransferRemark('');
    setBeneSuccess('');
    setBeneError('');
  };

  // Handle Add Money / Deposit
  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsDepositing(true);
    setDepositSuccess('');

    setTimeout(() => {
      setUserProfile(prev => ({
        ...prev,
        balance: prev.balance + amount
      }));

      const refNo = 'DEP' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const txnId = 'TXN-' + Math.floor(10000 + Math.random() * 90000);
      const depositTxn: Transfer = {
        id: txnId,
        beneficiaryId: 'SELF',
        beneficiaryName: 'Self-Deposit (Add Money)',
        bankName: 'VITAP Bank',
        accountNumber: userProfile.accountNo,
        amount: amount,
        sourceAccount: 'External Wallet',
        type: 'IMPS',
        remark: 'Add Money to Account',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'Success',
        referenceNo: refNo,
      };

      setTransfers(prev => [depositTxn, ...prev]);
      setDepositSuccess(depositAmount);
      setDepositAmount('');
      setIsDepositing(false);
    }, 800);
  };

  // Handle Beneficiary Creation
  const handleCreateBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    setBeneError('');
    setBeneSuccess('');

    if (!newBeneName.trim()) {
      setBeneError('Beneficiary name is required.');
      return;
    }
    if (!newBeneAccNum.trim()) {
      setBeneError('Account number is required.');
      return;
    }
    if (!newBeneBank.trim()) {
      setBeneError('Bank name is required.');
      return;
    }
    
    const limitNum = parseFloat(newBeneLimit);
    if (isNaN(limitNum) || limitNum <= 0) {
      setBeneError('Daily transfer limit must be a positive number.');
      return;
    }

    const newBene: Beneficiary = {
      id: Date.now().toString(),
      name: newBeneName.trim(),
      accountNumber: newBeneAccNum.trim().toUpperCase(),
      bankName: newBeneBank.trim(),
      email: newBeneEmail.trim() || 'N/A',
      maxLimit: limitNum,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setBeneficiaries([newBene, ...beneficiaries]);
    setBeneSuccess(`Beneficiary "${newBene.name}" has been successfully added.`);
    
    // Reset fields
    setNewBeneName('');
    setNewBeneAccNum('');
    setNewBeneBank('');
    setNewBeneEmail('');
    setNewBeneLimit('15000');
  };

  // Quick action: Send funds to beneficiary
  const initiateTransferTo = (beneId: string) => {
    setSelectedBeneId(beneId);
    setActiveTab('transfer');
    setTransferError('');
  };

  // Delete Beneficiary
  const deleteBeneficiary = (id: string) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
    if (selectedBeneId === id) {
      setSelectedBeneId('');
    }
  };

  // Handle Funds Transfer Submit with custom progress simulation
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError('');

    if (!selectedBeneId) {
      setTransferError('Please select a beneficiary from the list.');
      return;
    }

    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      setTransferError('Please enter a valid transfer amount.');
      return;
    }

    const targetBene = beneficiaries.find(b => b.id === selectedBeneId);
    if (!targetBene) {
      setTransferError('Selected beneficiary was not found.');
      return;
    }

    const currentBalance = userProfile.balance;
    if (amount > currentBalance) {
      setTransferError(`Insufficient balance. Your current balance is ₹${currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
      return;
    }

    if (amount > targetBene.maxLimit) {
      setTransferError(`Amount exceeds the daily transfer limit of ₹${targetBene.maxLimit.toLocaleString('en-IN')} set for ${targetBene.name}.`);
      return;
    }

    const refNo = 'APX' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const txnId = 'TXN-' + Math.floor(10000 + Math.random() * 90000);
    
    const pendingTxn: Transfer = {
      id: txnId,
      beneficiaryId: targetBene.id,
      beneficiaryName: targetBene.name,
      bankName: targetBene.bankName,
      accountNumber: targetBene.accountNumber,
      amount: amount,
      sourceAccount: 'Primary Account',
      type: transferType,
      remark: transferRemark || 'Online Transfer',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Initiated',
      referenceNo: refNo,
    };

    setSimulatedTxn(pendingTxn);
    setIsSimulating(true);
    setSimulationStep(0);

    // Simulated multi-step processing timer (student style checklist step simulation)
    setTimeout(() => {
      setSimulationStep(1); // checking limits
      setTimeout(() => {
        setSimulationStep(2); // clearing funds
        setTimeout(() => {
          setSimulationStep(3); // success!
          
          setUserProfile(prev => ({
            ...prev,
            balance: prev.balance - amount
          }));

          const finalTxn: Transfer = { ...pendingTxn, status: 'Success' };
          setTransfers([finalTxn, ...transfers]);
          setSimulatedTxn(finalTxn);

          // Clear inputs
          setTransferAmount('');
          setTransferRemark('');
        }, 1000);
      }, 1000);
    }, 800);
  };

  const closeSimulation = () => {
    setIsSimulating(false);
    setSimulatedTxn(null);
    setActiveTab('history');
  };

  // Filter lists based on search values
  const filteredBeneficiaries = beneficiaries.filter(b => 
    b.name.toLowerCase().includes(searchBene.toLowerCase()) ||
    b.bankName.toLowerCase().includes(searchBene.toLowerCase()) ||
    b.accountNumber.toLowerCase().includes(searchBene.toLowerCase())
  );

  const filteredTransfers = transfers.filter(t => 
    t.beneficiaryName.toLowerCase().includes(searchTxn.toLowerCase()) ||
    t.bankName.toLowerCase().includes(searchTxn.toLowerCase()) ||
    t.referenceNo.toLowerCase().includes(searchTxn.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#1f2937] font-sans flex flex-col">
      
      {/* 1. LOGIN SCREEN CONTAINER */}
      {!isLoggedIn ? (
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-gray-300 rounded shadow-md overflow-hidden">
            
            {/* Header style - Simple blue bar with title */}
            <div className="bg-[#1e40af] text-white p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Landmark className="w-6 h-6" />
                <h1 className="text-xl font-bold uppercase tracking-wide">VITAP Private Bank</h1>
              </div>
              <p className="text-xs text-blue-100 uppercase tracking-widest font-semibold">
                Online Banking Portal
              </p>
            </div>

            {/* Login Card Body */}
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-bold text-[#111827] mb-4 text-center">Sign In with Your Account</h2>
              
              {loginError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Username:</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. yakshitha"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded text-sm text-[#111827] focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password:</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-9 pr-10 py-2 bg-white border border-gray-300 rounded text-sm text-[#111827] focus:outline-none focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoggingIn}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold py-2.5 rounded text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <span>login</span>
                  )}
                </button>
              </form>



            </div>
          </div>
        </div>
      ) : (
        
        // 2. MAIN LOGGED-IN PORTAL VIEW (STUDENT PROJECT INSPIRED LAYOUT)
        <div className="flex-grow flex flex-col">
          
          {/* Main Top Header - Clean Classic Corporate Blue Banner */}
          <header className="bg-[#1e40af] text-white border-b border-blue-900 shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              
              {/* Brand Logo - Styled simply like a local project logo */}
              <div className="flex items-center gap-2">
                <div className="bg-white text-[#1e40af] p-1.5 rounded">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight uppercase">VITAP Private Bank</span>
                  <span className="text-[10px] block text-blue-200 font-semibold tracking-wider -mt-1">online banking portal</span>
                </div>
              </div>

              {/* User Center Profile & Logout */}
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white">Hi, {userProfile.name}</p>
                  <p className="text-[10px] text-blue-200 font-mono">{userProfile.email}</p>
                </div>
                
                {/* Visual Initials Circle */}
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold border border-blue-400">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </div>

                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-3 rounded transition-colors cursor-pointer"
                  title="Logout Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>

            </div>
          </header>

          {/* Navigation Bar - Look-and-Feel of Simple Folder Tabs */}
          <div className="bg-white border-b border-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex flex-wrap space-x-1 pt-3" aria-label="Tabs">
                
                <button
                  onClick={() => setActiveTab('balance')}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold border-t border-x rounded-t transition-all cursor-pointer ${
                    activeTab === 'balance'
                      ? 'bg-[#1e40af] text-white border-blue-900'
                      : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Account Balance
                </button>

                <button
                  onClick={() => setActiveTab('deposit')}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold border-t border-x rounded-t transition-all cursor-pointer ${
                    activeTab === 'deposit'
                      ? 'bg-[#1e40af] text-white border-blue-900'
                      : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Make Deposit
                </button>

                <button
                  onClick={() => setActiveTab('beneficiaries')}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold border-t border-x rounded-t transition-all cursor-pointer ${
                    activeTab === 'beneficiaries'
                      ? 'bg-[#1e40af] text-white border-blue-900'
                      : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Beneficiary Directory
                </button>

                <button
                  onClick={() => setActiveTab('transfer')}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold border-t border-x rounded-t transition-all cursor-pointer ${
                    activeTab === 'transfer'
                      ? 'bg-[#1e40af] text-white border-blue-900'
                      : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Transfer Funds
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold border-t border-x rounded-t transition-all cursor-pointer ${
                    activeTab === 'history'
                      ? 'bg-[#1e40af] text-white border-blue-900'
                      : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Transfer Log &amp; Status
                </button>

              </nav>
            </div>
          </div>

          {/* Main Workspace Workspace Contents */}
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* TAB 1: ACCOUNT BALANCE */}
            {activeTab === 'balance' && (
              <div className="space-y-6 max-w-4xl mx-auto">

                {/* Account Details & Balance Card - Simple, Student-style card */}
                <div className="bg-white border border-gray-300 rounded p-6 shadow-sm">
                  <div className="border-b border-gray-200 pb-3 mb-4">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      Account Balance &amp; Profile Details
                    </h3>
                    <p className="text-xs text-gray-500">your savings account at VIT AP BANK.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    
                    {/* Primary Balance Display */}
                    <div className="bg-gray-50 border border-gray-200 rounded p-5 flex flex-col justify-center">
                      <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider block">Available Balance</span>
                      <p className="text-3xl font-bold font-mono text-gray-900 mt-2">
                        ₹{userProfile.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    {/* Profile Information details table */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-500 font-semibold">Account Holder Name:</span>
                        <span className="text-gray-900 font-bold">{userProfile.name}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-500 font-semibold">Account Number:</span>
                        <span className="text-gray-900 font-mono font-bold">{userProfile.accountNo}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-500 font-semibold">Associated Email:</span>
                        <span className="text-gray-900 font-mono">{userProfile.email}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-500 font-semibold">Branch Name:</span>
                        <span className="text-gray-900 font-bold">VITAP Campus Branch</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Recent Transactions summary (Clean basic HTML Table look) */}
                <div className="bg-white border border-gray-300 rounded p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Recent Transaction History</h3>
                      <p className="text-xs text-gray-500">Summary of recent credits and debits</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('history')}
                      className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      View Full Ledger
                    </button>
                  </div>

                  {transfers.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded">
                      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-gray-500">No transactions yet</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Authorised transfers will appear here instantly.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100 text-xs font-bold text-gray-700 uppercase border-b border-gray-200">
                            <th className="py-2.5 px-4 border-r border-gray-200">Description</th>
                            <th className="py-2.5 px-4 border-r border-gray-200">Destination/Account</th>
                            <th className="py-2.5 px-4 border-r border-gray-200">Method</th>
                            <th className="py-2.5 px-4 text-right border-r border-gray-200">Amount (₹)</th>
                            <th className="py-2.5 px-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-gray-200">
                          {transfers.slice(0, 4).map((txn) => (
                            <tr key={txn.id} className="hover:bg-gray-50">
                              <td className="py-2.5 px-4 border-r border-gray-200 font-semibold text-gray-900">
                                {txn.beneficiaryName}
                              </td>
                              <td className="py-2.5 px-4 border-r border-gray-200 text-gray-600 font-mono">
                                {txn.bankName} ({txn.accountNumber})
                              </td>
                              <td className="py-2.5 px-4 border-r border-gray-200">
                                <span className="bg-gray-200 text-gray-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-300">
                                  {txn.type}
                                </span>
                              </td>
                              <td className={`py-2.5 px-4 text-right border-r border-gray-200 font-bold font-mono ${txn.beneficiaryId === 'SELF' ? 'text-green-600' : 'text-red-600'}`}>
                                {txn.beneficiaryId === 'SELF' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                <span className="bg-green-100 text-green-800 border border-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  {txn.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: MAKE DEPOSIT */}
            {activeTab === 'deposit' && (
              <div className="max-w-xl mx-auto">
                <div className="bg-white border border-gray-300 rounded p-6 shadow-sm">
                  
                  <div className="border-b border-gray-200 pb-3 mb-5">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-green-600" />
                      Make Deposit
                    </h3>
                  </div>

                  <div className="bg-gray-50 border border-gray-300 rounded p-4 mb-5 text-xs flex justify-between items-center">
                    <div>
                      <span className="text-gray-500 font-semibold block">Current Account Balance</span>
                      <span className="text-gray-400 font-mono block mt-0.5">No: {userProfile.accountNo}</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-gray-800">
                      ₹{userProfile.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <form onSubmit={handleAddMoney} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Enter Deposit Amount (₹):
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-bold text-xs">₹</span>
                        <input 
                          type="number"
                          value={depositAmount}
                          onChange={(e) => {
                            setDepositAmount(e.target.value);
                            if (depositSuccess) setDepositSuccess('');
                          }}
                          placeholder="e.g. 5000"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-gray-300 rounded text-xs font-mono text-gray-800 focus:outline-none focus:border-blue-500"
                          min="100"
                          step="100"
                          required
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">Minimum deposit amount is ₹100.</p>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isDepositing}
                      className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-75 text-white font-bold py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {isDepositing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Processing Deposit...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Deposit Funds</span>
                        </>
                      )}
                    </button>
                  </form>

                  {depositSuccess && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded text-xs font-semibold">
                      ✓ ₹{parseFloat(depositSuccess).toLocaleString('en-IN', { minimumFractionDigits: 2 })} has been successfully deposited into your account!
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* TAB 2: BENEFICIARY DIRECTORY */}
            {activeTab === 'beneficiaries' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Register Beneficiary Card */}
                  <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-300 rounded p-5 shadow-sm">
                      
                      <div className="border-b border-gray-200 pb-3 mb-4">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                          <Plus className="w-4 h-4 text-blue-600" />
                          Register Beneficiary
                        </h3>
                        <p className="text-[11px] text-gray-500">add a new account</p>
                      </div>

                      {beneError && (
                        <div className="mb-4 p-2.5 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                          {beneError}
                        </div>
                      )}

                      {beneSuccess && (
                        <div className="mb-4 p-2.5 bg-green-100 border border-green-400 text-green-700 rounded text-xs">
                          {beneSuccess}
                        </div>
                      )}

                      <form onSubmit={handleCreateBeneficiary} className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-0.5">Beneficiary Name *</label>
                          <input 
                            type="text"
                            value={newBeneName}
                            onChange={(e) => setNewBeneName(e.target.value)}
                            placeholder="Full Name (e.g. Ramesh Kumar)"
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-0.5">Account Number *</label>
                          <input 
                            type="text"
                            value={newBeneAccNum}
                            onChange={(e) => setNewBeneAccNum(e.target.value)}
                            placeholder="Account Number / IBAN"
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-mono uppercase focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-0.5">Receiving Bank Name *</label>
                          <input 
                            type="text"
                            value={newBeneBank}
                            onChange={(e) => setNewBeneBank(e.target.value)}
                            placeholder="e.g. SBI, HDFC, ICICI"
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-0.5">Email Address (Optional)</label>
                          <input 
                            type="email"
                            value={newBeneEmail}
                            onChange={(e) => setNewBeneEmail(e.target.value)}
                            placeholder="e.g. ramesh@gmail.com"
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-0.5">Daily limit</label>
                          <input 
                            type="number"
                            value={newBeneLimit}
                            onChange={(e) => setNewBeneLimit(e.target.value)}
                            placeholder="Daily Limit Amount"
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-mono focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Beneficiary</span>
                        </button>
                      </form>

                    </div>
                  </div>

                  {/* Registered Beneficiaries List Column */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-300 rounded p-5 shadow-sm">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3 mb-4">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">Registered Beneficiary Directory</h3>
                        </div>
                        
                        {/* Search Input bar */}
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                            <Search className="w-3.5 h-3.5" />
                          </span>
                          <input 
                            type="text" 
                            placeholder="Filter by name/bank..."
                            value={searchBene}
                            onChange={(e) => setSearchBene(e.target.value)}
                            className="w-full sm:w-52 pl-7 pr-2.5 py-1 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500 text-gray-800"
                          />
                        </div>
                      </div>

                      {filteredBeneficiaries.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded">
                          <Users className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs font-bold text-gray-500">No beneficiaries matching search criteria</p>
                          <p className="text-[11px] text-gray-400">Try searching for another keyword or register a new one.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredBeneficiaries.map((bene) => (
                            <div 
                              key={bene.id}
                              className="border border-gray-300 rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-xs font-bold text-gray-900">{bene.name}</h4>
                                  <span className="text-[9px] bg-blue-100 text-blue-800 border border-blue-300 font-bold px-1 rounded uppercase">
                                    {bene.bankName}
                                  </span>
                                </div>
                                <p className="text-[11px] font-mono text-gray-600 mt-0.5">Acc No: {bene.accountNumber}</p>
                                <div className="flex gap-3 text-[10px] text-gray-500 mt-1">
                                  <span>Email: <strong className="text-gray-700">{bene.email}</strong></span>
                                  <span>Registered: <strong className="text-gray-700">{bene.createdAt}</strong></span>
                                </div>
                              </div>

                              <div className="flex sm:flex-col items-end gap-2 justify-between border-t sm:border-t-0 border-gray-200 pt-2 sm:pt-0">
                                <div className="text-left sm:text-right">
                                  <span className="text-[9px] text-gray-500 block uppercase font-bold">Daily Ceiling</span>
                                  <span className="text-xs font-bold font-mono text-gray-800">
                                    ₹{bene.maxLimit.toLocaleString('en-IN')}
                                  </span>
                                </div>

                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => deleteBeneficiary(bene.id)}
                                    className="text-[10px] text-red-600 hover:text-red-800 font-bold px-2 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                  <button 
                                    onClick={() => initiateTransferTo(bene.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 text-[10px] rounded transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                                  >
                                    <Send className="w-2.5 h-2.5" />
                                    <span>Send Money</span>
                                  </button>
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: FUNDS TRANSFER FORM */}
            {activeTab === 'transfer' && (
              <div className="max-w-xl mx-auto">
                <div className="bg-white border border-gray-300 rounded p-6 shadow-sm">
                  
                  <div className="border-b border-gray-200 pb-3 mb-5">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-blue-600" />
                      Initiate Funds Transfer
                    </h3>
                    <p className="text-xs text-gray-500">initiate money dispatch transaction securely</p>
                  </div>

                  {transferError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                      {transferError}
                    </div>
                  )}

                  <form onSubmit={handleTransferSubmit} className="space-y-4">
                    
                    {/* Debit Source info card */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        1. Debit Account:
                      </label>
                      <div className="bg-gray-50 border border-gray-300 rounded p-3 flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-gray-800 block">Primary Account Balance</strong>
                          <span className="text-gray-500 font-mono block mt-0.5">No: {userProfile.accountNo}</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-blue-800">
                          ₹{userProfile.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Choose Beneficiary Dropdown select option */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-gray-700 uppercase">
                          2. Select Recipient Beneficiary:
                        </label>
                        <button 
                          type="button"
                          onClick={() => setActiveTab('beneficiaries')}
                          className="text-[11px] text-blue-600 hover:underline font-bold cursor-pointer"
                        >
                          + Add New
                        </button>
                      </div>

                      {beneficiaries.length === 0 ? (
                        <div className="text-center py-4 bg-gray-50 border border-dashed border-gray-300 rounded">
                          <p className="text-xs text-gray-500 mb-1">No beneficiaries registered yet.</p>
                          <button 
                            type="button" 
                            onClick={() => setActiveTab('beneficiaries')}
                            className="text-xs text-blue-600 font-bold underline cursor-pointer"
                          >
                            Add beneficiary first
                          </button>
                        </div>
                      ) : (
                        <select 
                          value={selectedBeneId}
                          onChange={(e) => setSelectedBeneId(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                          required
                        >
                          <option value="">-- Choose Registered Beneficiary --</option>
                          {beneficiaries.map(b => (
                            <option key={b.id} value={b.id}>
                              {b.name} ({b.bankName} • Acc: {b.accountNumber} • Daily Limit: ₹{b.maxLimit.toLocaleString()})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Amount & Method selection inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          3. Transfer Amount (₹):
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-500 font-bold text-xs">₹</span>
                          <input 
                            type="number"
                            step="0.01"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-6 pr-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-mono text-gray-800 focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          4. Settlement Method:
                        </label>
                        <select
                          value={transferType}
                          onChange={(e) => setTransferType(e.target.value as 'IMPS' | 'NEFT' | 'RTGS')}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                          required
                        >
                          <option value="IMPS">IMPS (Immediate Transfer)</option>
                          <option value="NEFT">NEFT (National Net Transfer)</option>
                          <option value="RTGS">RTGS (Large Real-Time Gross)</option>
                        </select>
                      </div>

                    </div>

                    {/* Comments Remarks input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        5. Memo / Remarks note:
                      </label>
                      <input 
                        type="text"
                        value={transferRemark}
                        onChange={(e) => setTransferRemark(e.target.value)}
                        placeholder="e.g. Loan, bills, test transfer"
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit"
                      className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-2 rounded text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      <span>Verify and Execute Transfer</span>
                    </button>

                  </form>

                </div>
              </div>
            )}

            {/* TAB 4: COMPLETE LIST OF HISTORICAL TRANSFERS */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-300 rounded p-6 shadow-sm">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Transfer Settlement Ledger</h3>
                      <p className="text-xs text-gray-500">History record of all simulated money transfers</p>
                    </div>

                    {/* Search filter input bar */}
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-400">
                        <Search className="w-3.5 h-3.5" />
                      </span>
                      <input 
                        type="text" 
                        placeholder="Filter transactions..."
                        value={searchTxn}
                        onChange={(e) => setSearchTxn(e.target.value)}
                        className="w-full sm:w-52 pl-7 pr-2.5 py-1 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500 text-gray-800"
                      />
                    </div>
                  </div>

                  {filteredTransfers.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded">
                      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs font-bold text-gray-500">No transfer history matches your search filter</p>
                      <p className="text-xs text-gray-400">Complete a transaction in the transfer page to write an entry.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100 text-[11px] font-bold text-gray-700 uppercase border-b border-gray-300">
                            <th className="py-2.5 px-4 border-r border-gray-200">Ref ID / Number</th>
                            <th className="py-2.5 px-4 border-r border-gray-200">Date and Time</th>
                            <th className="py-2.5 px-4 border-r border-gray-200">Recipient Target Name</th>
                            <th className="py-2.5 px-4 text-center border-r border-gray-200">Type</th>
                            <th className="py-2.5 px-4 border-r border-gray-200">Source Account Type</th>
                            <th className="py-2.5 px-4 text-right border-r border-gray-200">Amount (₹)</th>
                            <th className="py-2.5 px-4 text-center">Receipt Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-xs">
                          {filteredTransfers.map((txn) => (
                            <tr key={txn.id} className="hover:bg-gray-50 text-gray-700">
                              <td className="py-2.5 px-4 border-r border-gray-200 font-medium">
                                <div className="text-gray-900 font-bold">{txn.id}</div>
                                <div className="text-[10px] text-gray-500 font-mono">{txn.referenceNo}</div>
                              </td>
                              <td className="py-2.5 px-4 border-r border-gray-200 font-mono text-gray-500">
                                {txn.timestamp}
                              </td>
                              <td className="py-2.5 px-4 border-r border-gray-200">
                                <div className="text-gray-900 font-bold">{txn.beneficiaryName}</div>
                                <div className="text-[10px] text-gray-500">{txn.bankName} • Account: {txn.accountNumber}</div>
                              </td>
                              <td className="py-2.5 px-4 border-r border-gray-200 text-center">
                                <span className="bg-gray-100 text-gray-800 border border-gray-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  {txn.type}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 border-r border-gray-200 text-gray-500">
                                {txn.beneficiaryId === 'SELF' ? `${txn.sourceAccount} Credit` : `${txn.sourceAccount} Debit`}
                              </td>
                              <td className={`py-2.5 px-4 text-right border-r border-gray-200 font-bold font-mono ${txn.beneficiaryId === 'SELF' ? 'text-green-600' : 'text-red-600'}`}>
                                {txn.beneficiaryId === 'SELF' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                <span className="inline-block bg-green-100 text-green-800 border border-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  {txn.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              </div>
            )}

          </main>

          {/* 3. SIMULATED LIVE SETTLEMENT STATUS MODAL (STUDENT CHECKLIST LOOK-AND-FEEL) */}
          {isSimulating && simulatedTxn && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded w-full max-w-md border border-gray-400 shadow-xl overflow-hidden">
                
                {/* Modal Header bar */}
                <div className="bg-blue-800 p-4 text-white text-center">
                  <h3 className="text-sm font-bold uppercase tracking-wide">
                    {simulationStep < 3 ? 'Executing ACH Transaction...' : 'Transfer Settlement Succeeded'}
                  </h3>
                  <p className="text-[11px] text-blue-200 mt-0.5 font-mono">Reference No: {simulatedTxn.referenceNo}</p>
                </div>

                {/* Checklist Steps */}
                <div className="p-5 space-y-4 text-xs text-gray-700">
                  
                  <div className="p-3 bg-gray-50 border border-gray-300 rounded">
                    <p className="font-bold text-gray-900 mb-2">Simulated Banking Execution Checklist:</p>
                    
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                          simulationStep >= 1 ? 'bg-green-600 border-green-700 text-white' : 'bg-gray-100 text-gray-400 border-gray-300'
                        }`}>
                          ✓
                        </span>
                        <span>Phase 1: Establishing secure connection to clearinghouse...</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                          simulationStep >= 2 ? 'bg-green-600 border-green-700 text-white' : 'bg-gray-100 text-gray-400 border-gray-300'
                        }`}>
                          {simulationStep >= 2 ? '✓' : '•'}
                        </span>
                        <span>Phase 2: Reviewing daily transfer limits & balance compliance...</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                          simulationStep >= 3 ? 'bg-green-600 border-green-700 text-white' : 'bg-gray-100 text-gray-400 border-gray-300'
                        }`}>
                          {simulationStep >= 3 ? '✓' : '•'}
                        </span>
                        <span>Phase 3: Dispatching funds to remote recipient ledger...</span>
                      </li>
                    </ul>
                  </div>

                  {/* Summary receipt info */}
                  <div className="bg-gray-50 p-3 border border-gray-300 rounded font-mono text-[11px] text-gray-600 space-y-1">
                    <p className="font-bold border-b border-gray-200 pb-1 mb-1 text-gray-700">TXN RECEIPT SUMMARY</p>
                    <p>Recipient: {simulatedTxn.beneficiaryName}</p>
                    <p>Account No: {simulatedTxn.accountNumber}</p>
                    <p>Bank: {simulatedTxn.bankName}</p>
                    <p>Method Code: {simulatedTxn.type}</p>
                    <p className="font-bold text-blue-800 border-t border-gray-200 pt-1 mt-1">
                      Total Amount: ₹{simulatedTxn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="text-center font-bold text-xs text-blue-800">
                    {simulationStep < 3 ? (
                      <p className="animate-pulse">Processing... Please wait a moment...</p>
                    ) : (
                      <p className="text-green-700">✓ Transaction successfully verified!</p>
                    )}
                  </div>

                </div>

                {/* Modal Footer controls */}
                <div className="bg-gray-100 border-t border-gray-300 p-3 flex justify-end">
                  <button 
                    onClick={closeSimulation}
                    disabled={simulationStep < 3}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-xs font-bold rounded transition-colors cursor-pointer"
                  >
                    Close Receipt
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
