import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  FaFingerprint, FaFileAlt, FaHistory, FaDownload, FaShieldAlt,
  FaCheckCircle, FaTimesCircle, FaGlobe, FaUpload, FaExclamationTriangle
} from 'react-icons/fa';
import { format } from 'date-fns';
import SHA256Display from '../components/evidence/SHA256Display';
import VerifyIntegrityButton from '../components/evidence/VerifyIntegrityButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { forensicAPI } from '../services/api';

const PageContainer = styled.div` max-width: 1200px; margin: 0 auto; `;
const PageHeader = styled.div` margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; `;
const PageTitle = styled.h1` font-size: 1.75rem; font-weight: 700; color: ${({ theme }) => theme.text}; display: flex; align-items: center; gap: 1rem; `;
const JobId = styled.code` background: ${({ theme }) => theme.background}; border: 1px solid ${({ theme }) => theme.cardBorder}; padding: 0.25rem 0.75rem; font-family: var(--font-mono); font-size: 0.875rem; color: ${({ theme }) => theme.primary}; border-radius: 4px; `;
const MetadataGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; `;
const MetadataCard = styled.div` background: ${({ theme }) => theme.cardBackground}; border: 1px solid ${({ theme }) => theme.cardBorder}; border-radius: 12px; padding: 1.5rem; `;
const MetadataHeader = styled.div` display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; border-bottom: 1px solid ${({ theme }) => theme.cardBorder}; padding-bottom: 0.75rem; color: ${({ theme }) => theme.primary}; font-size: 1.25rem; `;
const MetadataList = styled.div` display: flex; flex-direction: column; gap: 0.75rem; `;
const MetadataItem = styled.div` display: flex; justify-content: space-between; `;
const MetadataLabel = styled.span` color: ${({ theme }) => theme.textSecondary}; font-size: 0.875rem; `;
const MetadataValue = styled.span` color: ${({ theme }) => theme.text}; font-weight: 600; font-size: 0.875rem; font-family: ${({ mono }) => mono ? 'var(--font-mono)' : 'inherit'}; text-align: right; `;
const ActionButtons = styled.div` display: flex; gap: 1rem; margin-top: 2rem; `;
const ActionButton = styled.button` display: flex; align-items: center; gap: 0.75rem; background: ${({ theme }) => theme.primary}; color: ${({ theme }) => theme.cardBackground}; border: none; border-radius: 8px; padding: 1rem 1.5rem; font-weight: 600; cursor: pointer; &:hover { transform: translateY(-2px); box-shadow: 0 8px 30px ${({ theme }) => theme.primary}40; } `;

const EvidenceDetailPage = () => {
  const { jobId } = useParams();
  
  const { data: job, isLoading, error } = useQuery(
    ['jobDetails', jobId],
    () => forensicAPI.getJobDetails(jobId), // Real API call
    { enabled: !!jobId, refetchInterval: 10000 }
  );
  
  const handleDownloadPDF = () => {
    window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1'}/jobs/${jobId}/pdf`, '_blank');
  };

  if (isLoading) return <LoadingSpinner text="Loading forensic evidence details..." />;
  
  if (error) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: '#ef4444' }}>
      <FaExclamationTriangle size={50} />
      <h2>Evidence Not Found</h2>
      <p>{error.message}</p>
    </div>
  );

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <FaFingerprint /> Evidence Details <JobId>{job.job_id}</JobId>
        </PageTitle>
        <div style={{ color: job.status === 'completed' ? '#10b981' : '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase' }}>
          {job.status}
        </div>
      </PageHeader>
      
      <SHA256Display hash={job.metadata?.sha256_hash} jobId={job.job_id} />
      
      <MetadataGrid>
        <MetadataCard>
          <MetadataHeader><FaFileAlt /> File Information</MetadataHeader>
          <MetadataList>
            <MetadataItem><MetadataLabel>Filename</MetadataLabel><MetadataValue mono>{job.metadata?.file_name}</MetadataValue></MetadataItem>
            <MetadataItem><MetadataLabel>Size</MetadataLabel><MetadataValue>{(job.metadata?.file_size / 1024 / 1024).toFixed(2)} MB</MetadataValue></MetadataItem>
            <MetadataItem><MetadataLabel>MIME Type</MetadataLabel><MetadataValue mono>{job.metadata?.mime_type}</MetadataValue></MetadataItem>
            <MetadataItem>
              <MetadataLabel>Source</MetadataLabel>
              <MetadataValue>
                {job.source === 'url' ? <><FaGlobe /> URL</> : <><FaUpload /> Upload</>}
              </MetadataValue>
            </MetadataItem>
          </MetadataList>
        </MetadataCard>
        
        <MetadataCard>
          <MetadataHeader><FaHistory /> Timeline</MetadataHeader>
          <MetadataList>
            <MetadataItem><MetadataLabel>Acquired</MetadataLabel><MetadataValue>{format(new Date(job.created_at), 'yyyy-MM-dd HH:mm:ss')}</MetadataValue></MetadataItem>
            <MetadataItem><MetadataLabel>Completed</MetadataLabel><MetadataValue>{job.completed_at ? format(new Date(job.completed_at), 'yyyy-MM-dd HH:mm:ss') : 'Processing...'}</MetadataValue></MetadataItem>
            <MetadataItem><MetadataLabel>Chain Events</MetadataLabel><MetadataValue>{job.chain_of_custody?.length || 0}</MetadataValue></MetadataItem>
          </MetadataList>
        </MetadataCard>
      </MetadataGrid>
      
      <ActionButtons>
        <ActionButton onClick={handleDownloadPDF} disabled={job.status !== 'completed'}>
          <FaDownload /> Download Forensic Report
        </ActionButton>
        <VerifyIntegrityButton jobId={job.job_id} />
      </ActionButtons>
    </PageContainer>
  );
};

export default EvidenceDetailPage;
