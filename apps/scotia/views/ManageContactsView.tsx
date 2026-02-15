
import React, { useState, useMemo } from 'react';
import TopHeader from '../components/TopHeader';
import { Contact } from '../types';
import { SearchIcon, GiftIcon } from '../ScotiaIcons';
import RRButton from '../../shared/components/RRButton'; // Re-using shared button component

interface ManageContactsViewProps {
  onClose: () => void;
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  onNotify: (title: string, message: string, icon: string) => void;
  appIcon: string;
}

const ManageContactsView: React.FC<ManageContactsViewProps> = ({
  onClose,
  contacts,
  setContacts,
  onNotify,
  appIcon
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactAutodeposit, setNewContactAutodeposit] = useState(false);

  const filteredContacts = useMemo(() =>
    contacts.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [contacts, searchQuery]
  );

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactEmail.trim()) {
      onNotify("Error", "Name and Email are required.", appIcon);
      return;
    }
    const newContact: Contact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      email: newContactEmail.trim(),
      isFavorite: false,
      autodeposit: newContactAutodeposit,
    };
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    localStorage.setItem('scotia_contacts', JSON.stringify(updatedContacts));
    onNotify("Contact Added", `${newContact.name} added successfully!`, appIcon);
    setNewContactName('');
    setNewContactEmail('');
    setNewContactAutodeposit(false);
    setShowAddContactForm(false);
  };

  const handleDeleteContact = (id: string) => {
    const updatedContacts = contacts.filter(c => c.id !== id);
    setContacts(updatedContacts);
    localStorage.setItem('scotia_contacts', JSON.stringify(updatedContacts));
    onNotify("Contact Deleted", "Contact removed.", appIcon);
  };

  if (showAddContactForm) {
    return (
      <div className="absolute inset-0 z-[600] bg-black flex flex-col animate-in slide-in-from-right h-full">
        <TopHeader onBack={() => setShowAddContactForm(false)} title="Add New Contact" />
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          <div className="bg-[#1c1c1e] p-6 rounded-[24px] border border-white/5 shadow-2xl">
            <p className="text-zinc-500 font-black text-[11px] uppercase tracking-widest mb-3">Full Name</p>
            <input
              type="text"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              placeholder="e.g., Jane Doe"
              className="w-full bg-transparent text-white text-[18px] font-black outline-none"
            />
          </div>
          <div className="bg-[#1c1c1e] p-6 rounded-[24px] border border-white/5 shadow-2xl">
            <p className="text-zinc-500 font-black text-[11px] uppercase tracking-widest mb-3">Email Address</p>
            <input
              type="email"
              value={newContactEmail}
              onChange={(e) => setNewContactEmail(e.target.value)}
              placeholder="e.g., jane.doe@example.com"
              className="w-full bg-transparent text-white text-[18px] font-black outline-none"
            />
          </div>
          <div 
            onClick={() => setNewContactAutodeposit(!newContactAutodeposit)}
            className="bg-[#1c1c1e] p-6 rounded-[24px] border border-white/5 shadow-2xl flex justify-between items-center cursor-pointer active:bg-white/5 transition-all"
          >
            <div>
              <p className="text-white font-bold text-lg">Auto-deposit</p>
              <p className="text-zinc-500 text-xs font-medium">Funds automatically deposited</p>
            </div>
            <div className={`w-12 h-7 rounded-full transition-all relative p-1 ${newContactAutodeposit ? 'bg-green-600' : 'bg-zinc-700'}`}>
                <div className={`w-5 h-5 rounded-full bg-white transition-all transform shadow-md ${newContactAutodeposit ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>
        <div className="p-8 bg-black/90 backdrop-blur-xl border-t border-white/5">
          <RRButton onClick={handleAddContact} brand="scotia" disabled={!newContactName.trim() || !newContactEmail.trim()}>
            Add Contact
          </RRButton>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-[600] bg-black flex flex-col animate-in slide-in-from-right h-full">
      <TopHeader onBack={onClose} title="Manage Contacts" />
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        <div className="bg-[#1c1c1e] rounded-xl flex items-center px-4 py-3"><SearchIcon size={18} color="#555" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search contacts" className="bg-transparent border-none outline-none text-white ml-3 w-full" autoFocus /></div>
        
        {filteredContacts.length === 0 && (
          <div className="text-center text-zinc-500 text-sm py-10">No contacts found.</div>
        )}

        {filteredContacts.map((contact) => (
          <div key={contact.id} className="bg-[#1c1c1e] p-4 rounded-[24px] border border-white/5 shadow-2xl flex justify-between items-center active:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#ED0711]/10 flex items-center justify-center text-white font-bold text-lg">{contact.name[0]}</div>
              <div>
                <p className="text-white font-bold text-lg">{contact.name}</p>
                <p className="text-zinc-500 text-xs">{contact.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                {contact.autodeposit && (
                    <span className="text-green-500 text-[9px] font-black uppercase tracking-widest">Auto-Deposit</span>
                )}
                <button onClick={() => handleDeleteContact(contact.id)} className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/20 active:scale-90 transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-8 bg-black/90 backdrop-blur-xl border-t border-white/5">
          <RRButton onClick={() => setShowAddContactForm(true)} brand="scotia">
            <GiftIcon size={16} color="white" />
            Add New Contact
          </RRButton>
      </div>
    </div>
  );
};

export default ManageContactsView;