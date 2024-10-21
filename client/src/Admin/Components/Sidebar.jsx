'use client'

import * as React from 'react'
import { Folder, Lock, Plus, Settings, ShieldCheck, Wrench, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = React.useState(true)
  const [vaults, setVaults] = React.useState([
    { id: 1, name: 'Personal', items: ['Email', 'Banking', 'Social Media'] },
    { id: 2, name: 'Work', items: ['Company Accounts', 'Project Logins'] },
  ])
  const [newVaultName, setNewVaultName] = React.useState('')

  const addVault = () => {
    if (newVaultName.trim()) {
      setVaults([...vaults, { id: Date.now(), name: newVaultName, items: [] }])
      setNewVaultName('')
    }
  }

  const addVaultItem = (vaultId) => {
    const updatedVaults = vaults.map(vault => {
      if (vault.id === vaultId) {
        return { ...vault, items: [...vault.items, `New Password ${vault.items.length + 1}`] }
      }
      return vault
    })
    setVaults(updatedVaults)
  }

  return (
    <div className={`h-screen bg-background border-r transition-all duration-300 flex ${isExpanded ? 'w-64' : 'w-16'}`}>
      <div className={`flex flex-col flex-grow overflow-y-auto ${isExpanded ? 'p-4' : 'p-2'}`}>
        {isExpanded && <h1 className="text-2xl font-bold mb-4">Password Manager</h1>}

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md">
            <div className="flex items-center">
              <Lock className="mr-2" />
              {isExpanded && <span>Vaults</span>}
            </div>
            {isExpanded && <Plus className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent>
            {isExpanded && (
              <div className="pl-4 mt-2 space-y-2">
                {vaults.map(vault => (
                  <Collapsible key={vault.id}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md">
                      <div className="flex items-center">
                        <Folder className="mr-2 h-4 w-4" />
                        <span>{vault.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          addVaultItem(vault.id)
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="pl-6 mt-1 space-y-1">
                        {vault.items.map((item, index) => (
                          <li key={index} className="text-sm flex items-center space-x-2">
                            <Lock className="h-3 w-3" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
            {isExpanded && (
              <div className="pl-4 mt-2 flex items-center space-x-2">
                <Input
                  placeholder="New Vault Name"
                  value={newVaultName}
                  onChange={(e) => setNewVaultName(e.target.value)}
                  className="text-sm"
                />
                <Button size="sm" onClick={addVault}>Add</Button>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible className="mt-4">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md">
            <div className="flex items-center">
              <Wrench className="mr-2" />
              {isExpanded && <span>Tools</span>}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {isExpanded && (
              <ul className="pl-4 mt-2 space-y-2">
                <li className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Password Generator</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Password Health Checker</span>
                </li>
              </ul>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible className="mt-4">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md">
            <div className="flex items-center">
              <Settings className="mr-2" />
              {isExpanded && <span>Settings</span>}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {isExpanded && (
              <ul className="pl-4 mt-2 space-y-2">
                <li>Account</li>
                <li>Security</li>
                <li>Preferences</li>
              </ul>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 -right-4 bg-background border border-input"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  )
}
