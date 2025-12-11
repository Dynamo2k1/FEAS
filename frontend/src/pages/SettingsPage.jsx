import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaCog, 
  FaMoon, 
  FaServer, 
  FaShieldAlt, 
  FaSave,
  FaRedo
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useThemeStore } from '../store/themeStore';
import ThemeSwitcher from '../components/common/ThemeSwitcher';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  padding-bottom: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 1rem;
  
  span {
    color: ${({ theme }) => theme.primary};
  }
`;

const SettingsSection = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 4px;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.text};
  font-family: var(--font-mono);
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;

const SwitchInput = styled.input`
  display: none;
`;

const SwitchSlider = styled.div`
  width: 48px;
  height: 24px;
  background: ${({ theme, checked }) => 
    checked ? theme.primary : theme.cardBorder};
  border-radius: 12px;
  position: relative;
  transition: all 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ checked }) => checked ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: all 0.2s ease;
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.cardBackground};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.primary}40;
  }
`;

const SettingsPage = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [retentionDays, setRetentionDays] = useState(30);
  const [apiUrl, setApiUrl] = useState(process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1');

  const handleSave = () => {
    // Save settings logic here (e.g., to localStorage or backend)
    toast.success('Settings saved successfully');
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <FaCog /> System <span>Settings</span>
        </PageTitle>
      </PageHeader>

      <SettingsSection>
        <SectionTitle>
          <FaMoon /> Appearance
        </SectionTitle>
        <FormGroup>
          <Label>Interface Theme</Label>
          <ThemeSwitcher />
        </FormGroup>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FaServer /> Connection
        </SectionTitle>
        <FormGroup>
          <Label>API Endpoint URL</Label>
          <Input 
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://localhost:8000/api/v1"
          />
        </FormGroup>
        <FormGroup>
          <ToggleSwitch>
            <SwitchInput 
              type="checkbox" 
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <SwitchSlider checked={autoRefresh} theme={useThemeStore.getState()} />
            <span style={{ color: '#fff' }}>Enable Auto-refresh for Job Monitor</span>
          </ToggleSwitch>
        </FormGroup>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FaShieldAlt /> Security & Retention
        </SectionTitle>
        <FormGroup>
          <Label>Local Evidence Retention (Days)</Label>
          <Input 
            type="number"
            value={retentionDays}
            onChange={(e) => setRetentionDays(e.target.value)}
            min="1"
            max="365"
          />
        </FormGroup>
      </SettingsSection>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <Button onClick={() => window.location.reload()} style={{ background: 'transparent', border: '1px solid #666', color: '#fff' }}>
          <FaRedo /> Reset Defaults
        </Button>
        <Button onClick={handleSave}>
          <FaSave /> Save Changes
        </Button>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
