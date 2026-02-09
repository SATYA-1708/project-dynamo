import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { useEffect } from 'react';

const MemberTable = ({ searchQuery, roleFilter }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'ascending'
  });

  const [teamMembers, setTeamMembers] = useState([]);
  
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/users/team-members`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const realUsers = await response.json();
        
        // Generate random data for other fields while keeping name and email real
        const randomizedMembers = realUsers.map(user => ({
          ...user,
          role: ['Admin', 'Member', 'Viewer'][Math.floor(Math.random() * 3)],
          avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
          lastActive: ['Just now', '5 minutes ago', '2 hours ago', '1 day ago', '3 days ago', '1 week ago'][Math.floor(Math.random() * 6)],
          status: ['Online', 'Away', 'Offline'][Math.floor(Math.random() * 3)],
          department: ['Product', 'Engineering', 'Design', 'Marketing', 'Sales'][Math.floor(Math.random() * 5)],
          joinedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }));
        
        setTeamMembers(randomizedMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };
    
    fetchTeamMembers();
  }, []);

  // Filter members based on search query and role filter
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      (member.name && member.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.email && member.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.department && member.department.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === 'All' || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Sort members based on sort config
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <Icon name="ArrowUpDown" size={14} className="ml-1 opacity-50" />;
    }
    return sortConfig.direction === 'ascending' 
      ? <Icon name="ArrowUp" size={14} className="ml-1" />
      : <Icon name="ArrowDown" size={14} className="ml-1" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Online': return 'bg-success';
      case 'Away': return 'bg-warning';
      case 'Offline': return 'bg-secondary-300';
      default: return 'bg-secondary-300';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-primary-100 text-primary-700';
      case 'Member': return 'bg-secondary-100 text-secondary-700';
      case 'Viewer': return 'bg-accent-100 text-accent-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                <div className="flex items-center cursor-pointer" onClick={() => requestSort('name')}>
                  <span>Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                <div className="flex items-center cursor-pointer" onClick={() => requestSort('role')}>
                  <span>Role</span>
                  {getSortIcon('role')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                <div className="flex items-center cursor-pointer" onClick={() => requestSort('department')}>
                  <span>Department</span>
                  {getSortIcon('department')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                <div className="flex items-center cursor-pointer" onClick={() => requestSort('lastActive')}>
                  <span>Last Active</span>
                  {getSortIcon('lastActive')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                <div className="flex items-center cursor-pointer" onClick={() => requestSort('status')}>
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedMembers.map((member) => (
              <tr key={member.id} className="hover:bg-secondary-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <Image 
                        src={member.avatar} 
                        alt={member.name} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-text-primary">{member.name}</div>
                      <div className="text-sm text-text-secondary">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getRoleBadgeColor(member.role)}`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                  {member.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {member.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(member.status)} mr-2`}></div>
                    <span className="text-sm text-text-secondary">{member.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-1 text-secondary-600 hover:text-primary transition-colors duration-200" title="Edit Member">
                      <Icon name="Edit" size={16} />
                    </button>
                    <button className="p-1 text-secondary-600 hover:text-primary transition-colors duration-200" title="Change Role">
                      <Icon name="Shield" size={16} />
                    </button>
                    <div className="relative">
                      <button className="p-1 text-secondary-600 hover:text-primary transition-colors duration-200" title="More Options">
                        <Icon name="MoreVertical" size={16} />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {sortedMembers.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="Users" size={48} color="#CBD5E1" className="mx-auto mb-4" />
            <p className="text-text-secondary">No team members found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedMembers.map((member) => (
              <div key={member.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <Image 
                        src={member.avatar} 
                        alt={member.name} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-text-primary">{member.name}</div>
                      <div className="text-xs text-text-secondary">{member.email}</div>
                    </div>
                  </div>
                  <button className="p-1 text-secondary-600 hover:text-primary transition-colors duration-200">
                    <Icon name="MoreVertical" size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col">
                    <span className="text-text-secondary">Role</span>
                    <span className={`mt-1 px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full w-fit ${getRoleBadgeColor(member.role)}`}>
                      {member.role}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-secondary">Department</span>
                    <span className="text-text-primary">{member.department}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-secondary">Last Active</span>
                    <span className="text-text-primary">{member.lastActive}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-secondary">Status</span>
                    <div className="flex items-center mt-1">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(member.status)} mr-1.5`}></div>
                      <span className="text-text-primary">{member.status}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="p-1.5 text-secondary-600 hover:text-primary transition-colors duration-200 bg-secondary-50 rounded-full">
                    <Icon name="Edit" size={14} />
                  </button>
                  <button className="p-1.5 text-secondary-600 hover:text-primary transition-colors duration-200 bg-secondary-50 rounded-full">
                    <Icon name="Shield" size={14} />
                  </button>
                  <button className="p-1.5 text-error-600 hover:text-error transition-colors duration-200 bg-error-50 rounded-full">
                    <Icon name="UserMinus" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Users" size={48} color="#CBD5E1" className="mx-auto mb-4" />
          <p className="text-text-primary font-medium mb-2">No team members found</p>
          <p className="text-text-secondary mb-6">Try adjusting your search or filter criteria</p>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberTable;