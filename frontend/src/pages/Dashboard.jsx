import React from 'react';
import styled from 'styled-components';
import { 
  FaFingerprint, 
  FaDatabase, 
  FaChartLine,
  FaShieldAlt,
  FaHistory,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaServer
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { forensicAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardContainer = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme, color }) => color || theme.primary};
`;

const StatContent = styled.div`flex: 1;`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  font-family: var(--font-mono);
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 0.25rem;
`;

const Section = styled.section`margin-top: 2rem;`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionCard = styled(Link)`
  background: ${({ theme }) => theme.cardBackground};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
`;

const ActionIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 1rem;
`;

const ActionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const ActionDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.5;
`;

const Dashboard = () => {
  // Use real API call for analytics
  const { data: stats, isLoading } = useQuery('analytics', () => forensicAPI.getAnalytics('7d'), {
    refetchInterval: 30000,
    onError: () => {
      // Fallback/Empty state if API fails
      return { total_jobs: 0, completed_jobs: 0, pending_jobs: 0, failed_jobs: 0 };
    }
  });

  if (isLoading) return <LoadingSpinner text="Loading system analytics..." />;

  const quickActions = [
    { to: '/submit', icon: <FaFingerprint />, title: 'Acquire Evidence', description: 'Submit new evidence via URL or file upload' },
    { to: '/monitor', icon: <FaDatabase />, title: 'Job Monitor', description: 'Track evidence processing jobs in real-time' },
    { to: '/evidence', icon: <FaShieldAlt />, title: 'Evidence Browser', description: 'Browse and manage acquired evidence' },
  ];

  return (
    <>
      <DashboardContainer>
        <StatCard>
          <StatIcon><FaDatabase /></StatIcon>
          <StatContent>
            <StatValue>{stats?.total_jobs || 0}</StatValue>
            <StatLabel>Total Evidence Jobs</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#10b981"><FaCheckCircle /></StatIcon>
          <StatContent>
            <StatValue>{stats?.completed_jobs || 0}</StatValue>
            <StatLabel>Completed</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#3b82f6"><FaClock /></StatIcon>
          <StatContent>
            <StatValue>{stats?.pending_jobs || 0}</StatValue>
            <StatLabel>Processing</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#ef4444"><FaExclamationTriangle /></StatIcon>
          <StatContent>
            <StatValue>{stats?.failed_jobs || 0}</StatValue>
            <StatLabel>Failed</StatLabel>
          </StatContent>
        </StatCard>
      </DashboardContainer>

      <Section>
        <SectionTitle><FaFingerprint /> Quick Actions</SectionTitle>
        <QuickActions>
          {quickActions.map((action, index) => (
            <ActionCard key={index} to={action.to}>
              <ActionIcon>{action.icon}</ActionIcon>
              <ActionTitle>{action.title}</ActionTitle>
              <ActionDescription>{action.description}</ActionDescription>
            </ActionCard>
          ))}
        </QuickActions>
      </Section>
    </>
  );
};

export default Dashboard;
