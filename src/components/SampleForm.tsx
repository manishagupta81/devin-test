import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Paper,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';

interface FormState {
  // Section 0
  solutionType: { optionA: boolean; optionB: boolean };
  requestType: { poc: boolean; pilot: boolean; implementation: boolean; newUseCase: boolean };
  nextPhaseChange: string;
  projectName: string;
  businessUnit: string;
  businessSponsor: string;
  executiveSponsor: string;
  businessOwner: string;
  technicalOwner: string;
  designatedAdmins: string;
  submissionDate: string;
  targetGoLiveDate: string;
  pilotDuration: string;
  renewalReviewDate: string;
  outOfScope: string;
  businessObjective: {
    revenue: boolean;
    costReduction: boolean;
    riskMitigation: boolean;
    clientExperience: boolean;
    advisorExperience: boolean;
    productivity: boolean;
    regulatoryCompliance: boolean;
  };

  // Section 1
  endToEndWorkflow: string;
  trigger: string;
  inputs: string;
  processing: string;
  outputs: string;
  outputsGoNext: string;
  outputTypes: {
    text: boolean;
    summary: boolean;
    extractedFields: boolean;
    documentDraft: boolean;
    code: boolean;
    image: boolean;
    decisionRecommendation: boolean;
    other: boolean;
  };
  outputTypesOther: string;
  userType: { internal: boolean; external: boolean; both: boolean };
  exactAudience: string;
  sharingMethod: { directShare: boolean; intranetLink: boolean; embeddedInApp: boolean; other: boolean };
  sharingMethodOther: string;
  userAddRemoveProcess: string;
  approvalWorkflow: string;
  usersHavePermission: { yes: boolean; no: boolean };
  decisionSupport: {
    investment: boolean;
    trading: boolean;
    suitability: boolean;
    clientAdvice: boolean;
    hr: boolean;
    complianceApproval: boolean;
    amlKyc: boolean;
    underwriting: boolean;
    otherRegulated: boolean;
    internalProductivity: boolean;
  };
  humanInTheLoop: string;
  whoReviewsOutputs: string;
  whatMustBeValidated: string;
  stopUseCondition: string;
  disclaimerType: { systemEnforced: boolean; policyBased: boolean; no: boolean };
  disclosureLanguage: string;
  clientAdvisorFacing: string;
  harmScenario: string;
  materialImpact: { low: boolean; medium: boolean; high: boolean };
  worstCaseOutcome: string;
  whyGenAI: string;

  // Section 2
  aiType: {
    traditionalML: boolean;
    generativeAI: boolean;
    ragBased: boolean;
    agentic: boolean;
    hybrid: boolean;
  };
  foundationModel: string;
  modelVersion: string;
  roleInValueChain: { provider: boolean; deployer: boolean; both: boolean };
  initialRiskTier: { low: boolean; moderate: boolean; high: boolean; regulatorySensitive: boolean };
  additionalRiskCharacteristics: {
    profiling: boolean;
    automatedDecision: boolean;
    sensitiveData: boolean;
    customerAdvisory: boolean;
  };

  // Option A
  a1ModelType: { openSource: boolean; proprietaryAPI: boolean; other: boolean };
  a1AccessMode: { chatUI: boolean; api: boolean; embedded: boolean };
  a1RagImplemented: boolean;
  a1AgenticOrchestration: boolean;
  a1FineTuned: { yes: boolean; no: boolean };
  a1TrainingDataSource: string;
  a1DataLeavesFirm: { yes: boolean; no: boolean };
  a1DataLeavesSafeguards: string;
  a1Integrations: { apis: boolean; rpa: boolean; plugins: boolean; connectors: boolean };
  a1DataFlowSummary: string;

  a2KnowledgeSources: { files: boolean; links: boolean; connectors: boolean; databases: boolean; apis: boolean };
  a2DataTypes: { public: boolean; proprietary: boolean; clientConfidential: boolean; employeeConfidential: boolean };
  a2DataTypesExamples: string;
  a2DataSentOutside: { yes: boolean; no: boolean };
  a2DlpGuardrails: string;
  a2ExternalLicensing: { yes: boolean; no: boolean };
  a2KnowledgeStorage: string;
  a2RefreshFrequency: string;
  a2PromptLogging: { yes: boolean; no: boolean };
  a2RetentionPeriod: string;
  a2Governance: { dpia: boolean; dataMinimization: boolean; accessControls: boolean; dataRetention: boolean };
  a2Attestation: boolean;

  a3Testing: { functional: boolean; hallucination: boolean; adversarial: boolean; bias: boolean; mrmValidation: boolean };
  a3AccuracyMeasurement: string;
  a3FailureModes: string;
  a3HallucinationControls: { citations: boolean; internalDocs: boolean; manualVerification: boolean };
  a3RefusalConditions: string;
  a3DataExfiltrationControls: string;
  a3IncidentTracking: string;
  a3OngoingMonitoring: { drift: boolean; kpis: boolean; logging: boolean; incidentEscalation: boolean };

  a4PromptInjectionTesting: boolean;
  a4OutputFiltering: boolean;
  a4CybersecurityReview: boolean;
  a4KillSwitch: boolean;
  a4SensitiveDomains: { credit: boolean; pricing: boolean; underwriting: boolean; amlKyc: boolean; hr: boolean; profiling: boolean };
  a4BiasTesting: { yes: boolean; no: boolean };
  a4EthicsCouncil: { yes: boolean; no: boolean };

  a5OwnerResponsibilities: string;
  a5ReviewFrequency: string;
  a5ChangeTriggers: { newData: boolean; newUsers: boolean; newWorkflow: boolean; modelChange: boolean; featureChange: boolean };
  a5DecommissioningPlan: string;
  a5TrainingPlan: string;
  a5SuccessMetrics: string;

  // Option B
  b1VendorName: string;
  b1ProductName: string;
  b1FeatureName: string;
  b1VendorStatus: { newVendor: boolean; existingVendor: boolean };
  b1AIEmbedded: { yes: boolean; no: boolean };
  b1UnderlyingModel: string;
  b1ModelVersion: string;
  b1AccessMode: string;
  b1VendorTrains: { yes: boolean; no: boolean; optedOut: boolean };
  b1OptInRequired: { yes: boolean; no: boolean };
  b1GenAIDefault: { yes: boolean; no: boolean };
  b1Sandbox: { yes: boolean; no: boolean };
  b1ChangeNotification: { yes: boolean; no: boolean };
  b1AssessmentProcess: string;

  b2SpecificData: string;
  b2DataTypes: { public: boolean; proprietary: boolean; clientConfidential: boolean; employeeConfidential: boolean };
  b2DataSentExternal: { yes: boolean; no: boolean };
  b2DataSentDescription: string;
  b2DataProtection: string;
  b2Retention: string;
  b2IncidentNotification: string;
  b2AuditRights: string;
  b2TrainingDisabled: { yes: boolean; no: boolean };
  b2DataIsolation: string;
  b2OtherCustomersInfluence: { yes: boolean; no: boolean };
  b2RetentionFirmData: string;
  b2RetentionUserInputs: string;
  b2RetentionOutputs: string;
  b2RetentionConfigurable: { yes: boolean; no: boolean };
  b2CrossBorder: { yes: boolean; no: boolean };
  b2DlpGuardrails: string;
  b2Attestation: boolean;

  b3GovernanceReviewed: boolean;
  b3Soc2Verified: boolean;
  b3AuditRight: boolean;
  b3SubProcessors: boolean;
  b3ModelUpdateClause: boolean;
  b3NthPartyDependencies: string;

  b4PocObservations: string;
  b4TestingResults: string;
  b4FailureModes: string;
  b4HallucinationControls: { citations: boolean; internalLinking: boolean; verificationRequired: boolean };
  b4RefusalConditions: string;
  b4VendorProtections: { promptInjection: boolean; dataExfiltration: boolean; modelInversion: boolean; apiAbuse: boolean };
  b4Logging: string;
  b4DriftMonitoring: { yes: boolean; no: boolean };
  b4IncidentReadiness: string;
  b4FeatureEnabled: { global: boolean; roleBased: boolean };

  b5OperatingModel: string;
  b5ReviewFrequency: string;
  b5ChangeTriggers: { newData: boolean; newUsers: boolean; newUseCase: boolean; vendorFeatureChange: boolean; modelChange: boolean };
  b5DecommissioningPlan: string;
  b5TrainingPlan: string;
  b5SuccessMetrics: string;

  // Section 3
  s3VendorIndemnification: boolean;
  s3PlagiarismControls: boolean;
  s3DataLeakageProtections: boolean;
  s3StaffTrained: boolean;

  // Section 4
  s4WorkforceImpact: boolean;
  s4HRConsulted: boolean;
  s4AILiteracyTraining: boolean;
  s4AccountabilityDocumented: boolean;

  // Section 5
  s5Jurisdictions: string;
  s5EuAiAct: boolean;
  s5Gdpr: boolean;
  s5FinancialRegulator: boolean;
  s5HighRisk: boolean;
  s5HighRiskSpecify: string;

  // Section 6
  s6ResidualRisk: { low: boolean; moderate: boolean; elevated: boolean; high: boolean };
  s6KeyRisks: string;
  s6Mitigations: string;
  s6AttestationName: string;
  s6AttestationTitle: string;
  s6AttestationSignature: string;
  s6AttestationDate: string;
}

const initialFormState: FormState = {
  solutionType: { optionA: false, optionB: false },
  requestType: { poc: false, pilot: false, implementation: false, newUseCase: false },
  nextPhaseChange: '',
  projectName: '',
  businessUnit: '',
  businessSponsor: '',
  executiveSponsor: '',
  businessOwner: '',
  technicalOwner: '',
  designatedAdmins: '',
  submissionDate: '',
  targetGoLiveDate: '',
  pilotDuration: '',
  renewalReviewDate: '',
  outOfScope: '',
  businessObjective: {
    revenue: false,
    costReduction: false,
    riskMitigation: false,
    clientExperience: false,
    advisorExperience: false,
    productivity: false,
    regulatoryCompliance: false,
  },
  endToEndWorkflow: '',
  trigger: '',
  inputs: '',
  processing: '',
  outputs: '',
  outputsGoNext: '',
  outputTypes: {
    text: false,
    summary: false,
    extractedFields: false,
    documentDraft: false,
    code: false,
    image: false,
    decisionRecommendation: false,
    other: false,
  },
  outputTypesOther: '',
  userType: { internal: false, external: false, both: false },
  exactAudience: '',
  sharingMethod: { directShare: false, intranetLink: false, embeddedInApp: false, other: false },
  sharingMethodOther: '',
  userAddRemoveProcess: '',
  approvalWorkflow: '',
  usersHavePermission: { yes: false, no: false },
  decisionSupport: {
    investment: false,
    trading: false,
    suitability: false,
    clientAdvice: false,
    hr: false,
    complianceApproval: false,
    amlKyc: false,
    underwriting: false,
    otherRegulated: false,
    internalProductivity: false,
  },
  humanInTheLoop: '',
  whoReviewsOutputs: '',
  whatMustBeValidated: '',
  stopUseCondition: '',
  disclaimerType: { systemEnforced: false, policyBased: false, no: false },
  disclosureLanguage: '',
  clientAdvisorFacing: '',
  harmScenario: '',
  materialImpact: { low: false, medium: false, high: false },
  worstCaseOutcome: '',
  whyGenAI: '',
  aiType: {
    traditionalML: false,
    generativeAI: false,
    ragBased: false,
    agentic: false,
    hybrid: false,
  },
  foundationModel: '',
  modelVersion: '',
  roleInValueChain: { provider: false, deployer: false, both: false },
  initialRiskTier: { low: false, moderate: false, high: false, regulatorySensitive: false },
  additionalRiskCharacteristics: {
    profiling: false,
    automatedDecision: false,
    sensitiveData: false,
    customerAdvisory: false,
  },
  a1ModelType: { openSource: false, proprietaryAPI: false, other: false },
  a1AccessMode: { chatUI: false, api: false, embedded: false },
  a1RagImplemented: false,
  a1AgenticOrchestration: false,
  a1FineTuned: { yes: false, no: false },
  a1TrainingDataSource: '',
  a1DataLeavesFirm: { yes: false, no: false },
  a1DataLeavesSafeguards: '',
  a1Integrations: { apis: false, rpa: false, plugins: false, connectors: false },
  a1DataFlowSummary: '',
  a2KnowledgeSources: { files: false, links: false, connectors: false, databases: false, apis: false },
  a2DataTypes: { public: false, proprietary: false, clientConfidential: false, employeeConfidential: false },
  a2DataTypesExamples: '',
  a2DataSentOutside: { yes: false, no: false },
  a2DlpGuardrails: '',
  a2ExternalLicensing: { yes: false, no: false },
  a2KnowledgeStorage: '',
  a2RefreshFrequency: '',
  a2PromptLogging: { yes: false, no: false },
  a2RetentionPeriod: '',
  a2Governance: { dpia: false, dataMinimization: false, accessControls: false, dataRetention: false },
  a2Attestation: false,
  a3Testing: { functional: false, hallucination: false, adversarial: false, bias: false, mrmValidation: false },
  a3AccuracyMeasurement: '',
  a3FailureModes: '',
  a3HallucinationControls: { citations: false, internalDocs: false, manualVerification: false },
  a3RefusalConditions: '',
  a3DataExfiltrationControls: '',
  a3IncidentTracking: '',
  a3OngoingMonitoring: { drift: false, kpis: false, logging: false, incidentEscalation: false },
  a4PromptInjectionTesting: false,
  a4OutputFiltering: false,
  a4CybersecurityReview: false,
  a4KillSwitch: false,
  a4SensitiveDomains: { credit: false, pricing: false, underwriting: false, amlKyc: false, hr: false, profiling: false },
  a4BiasTesting: { yes: false, no: false },
  a4EthicsCouncil: { yes: false, no: false },
  a5OwnerResponsibilities: '',
  a5ReviewFrequency: '',
  a5ChangeTriggers: { newData: false, newUsers: false, newWorkflow: false, modelChange: false, featureChange: false },
  a5DecommissioningPlan: '',
  a5TrainingPlan: '',
  a5SuccessMetrics: '',
  b1VendorName: '',
  b1ProductName: '',
  b1FeatureName: '',
  b1VendorStatus: { newVendor: false, existingVendor: false },
  b1AIEmbedded: { yes: false, no: false },
  b1UnderlyingModel: '',
  b1ModelVersion: '',
  b1AccessMode: '',
  b1VendorTrains: { yes: false, no: false, optedOut: false },
  b1OptInRequired: { yes: false, no: false },
  b1GenAIDefault: { yes: false, no: false },
  b1Sandbox: { yes: false, no: false },
  b1ChangeNotification: { yes: false, no: false },
  b1AssessmentProcess: '',
  b2SpecificData: '',
  b2DataTypes: { public: false, proprietary: false, clientConfidential: false, employeeConfidential: false },
  b2DataSentExternal: { yes: false, no: false },
  b2DataSentDescription: '',
  b2DataProtection: '',
  b2Retention: '',
  b2IncidentNotification: '',
  b2AuditRights: '',
  b2TrainingDisabled: { yes: false, no: false },
  b2DataIsolation: '',
  b2OtherCustomersInfluence: { yes: false, no: false },
  b2RetentionFirmData: '',
  b2RetentionUserInputs: '',
  b2RetentionOutputs: '',
  b2RetentionConfigurable: { yes: false, no: false },
  b2CrossBorder: { yes: false, no: false },
  b2DlpGuardrails: '',
  b2Attestation: false,
  b3GovernanceReviewed: false,
  b3Soc2Verified: false,
  b3AuditRight: false,
  b3SubProcessors: false,
  b3ModelUpdateClause: false,
  b3NthPartyDependencies: '',
  b4PocObservations: '',
  b4TestingResults: '',
  b4FailureModes: '',
  b4HallucinationControls: { citations: false, internalLinking: false, verificationRequired: false },
  b4RefusalConditions: '',
  b4VendorProtections: { promptInjection: false, dataExfiltration: false, modelInversion: false, apiAbuse: false },
  b4Logging: '',
  b4DriftMonitoring: { yes: false, no: false },
  b4IncidentReadiness: '',
  b4FeatureEnabled: { global: false, roleBased: false },
  b5OperatingModel: '',
  b5ReviewFrequency: '',
  b5ChangeTriggers: { newData: false, newUsers: false, newUseCase: false, vendorFeatureChange: false, modelChange: false },
  b5DecommissioningPlan: '',
  b5TrainingPlan: '',
  b5SuccessMetrics: '',
  s3VendorIndemnification: false,
  s3PlagiarismControls: false,
  s3DataLeakageProtections: false,
  s3StaffTrained: false,
  s4WorkforceImpact: false,
  s4HRConsulted: false,
  s4AILiteracyTraining: false,
  s4AccountabilityDocumented: false,
  s5Jurisdictions: '',
  s5EuAiAct: false,
  s5Gdpr: false,
  s5FinancialRegulator: false,
  s5HighRisk: false,
  s5HighRiskSpecify: '',
  s6ResidualRisk: { low: false, moderate: false, elevated: false, high: false },
  s6KeyRisks: '',
  s6Mitigations: '',
  s6AttestationName: '',
  s6AttestationTitle: '',
  s6AttestationSignature: '',
  s6AttestationDate: '',
};

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <Box sx={{ mb: 3, mt: 4 }}>
    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    )}
    <Divider sx={{ mt: 1 }} />
  </Box>
);

const SubSectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 2 }}>
    {title}
  </Typography>
);

const FieldLabel: React.FC<{ label: string }> = ({ label }) => (
  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2, mb: 0.5 }}>
    {label}
  </Typography>
);

const SampleForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleTextChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleNestedCheckbox = (
    section: keyof FormState,
    field: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, boolean>),
        [field]: e.target.checked,
      },
    }));
  };

  const handleCheckbox = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, [field]: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formState);
    setSubmitSuccess(true);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* SECTION 0 */}
      <SectionHeader
        title="SECTION 0 - REQUEST SNAPSHOT"
        subtitle="All Submissions"
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <SubSectionHeader title="Solution Type" />
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={formState.solutionType.optionA} onChange={handleNestedCheckbox('solutionType', 'optionA')} />}
            label="Option A: Custom GPT / Custom In-House GenAI Application"
          />
          <FormControlLabel
            control={<Checkbox checked={formState.solutionType.optionB} onChange={handleNestedCheckbox('solutionType', 'optionB')} />}
            label="Option B: Vendor Tool (External SaaS / Third-Party AI Platform)"
          />
        </FormGroup>

        <SubSectionHeader title="Request Type" />
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={formState.requestType.poc} onChange={handleNestedCheckbox('requestType', 'poc')} />}
            label="Proof of Concept (POC) - Limited feasibility testing. No non-public client, employee, or corporate data is permitted. Public data only."
          />
          <FormControlLabel
            control={<Checkbox checked={formState.requestType.pilot} onChange={handleNestedCheckbox('requestType', 'pilot')} />}
            label="Pilot - Controlled deployment with limited users and/or approved data classes."
          />
          <FormControlLabel
            control={<Checkbox checked={formState.requestType.implementation} onChange={handleNestedCheckbox('requestType', 'implementation')} />}
            label="Implementation - Full production deployment."
          />
          <FormControlLabel
            control={<Checkbox checked={formState.requestType.newUseCase} onChange={handleNestedCheckbox('requestType', 'newUseCase')} />}
            label="New Use Case / Material Change - Expansion in workflow, users, data classes, model, or features."
          />
        </FormGroup>

        <FieldLabel label="What will change in the next phase (if applicable)?" />
        <TextField fullWidth multiline rows={2} value={formState.nextPhaseChange} onChange={handleTextChange('nextPhaseChange')} />

        <FieldLabel label="Project Name:" />
        <TextField fullWidth value={formState.projectName} onChange={handleTextChange('projectName')} />

        <FieldLabel label="Business Unit:" />
        <TextField fullWidth value={formState.businessUnit} onChange={handleTextChange('businessUnit')} />

        <FieldLabel label="Business Sponsor:" />
        <TextField fullWidth value={formState.businessSponsor} onChange={handleTextChange('businessSponsor')} />

        <FieldLabel label="Executive Sponsor:" />
        <TextField fullWidth value={formState.executiveSponsor} onChange={handleTextChange('executiveSponsor')} />

        <FieldLabel label="Business Owner (Accountable Executive):" />
        <TextField fullWidth value={formState.businessOwner} onChange={handleTextChange('businessOwner')} />

        <FieldLabel label="Technical Owner:" />
        <TextField fullWidth value={formState.technicalOwner} onChange={handleTextChange('technicalOwner')} />

        <FieldLabel label="Designated Admin(s) (manage sharing, updates, disable tool):" />
        <TextField fullWidth value={formState.designatedAdmins} onChange={handleTextChange('designatedAdmins')} />

        <FieldLabel label="Submission Date:" />
        <TextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={formState.submissionDate} onChange={handleTextChange('submissionDate')} />

        <FieldLabel label="Target Go-Live Date:" />
        <TextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={formState.targetGoLiveDate} onChange={handleTextChange('targetGoLiveDate')} />

        <FieldLabel label="Pilot Duration (if applicable):" />
        <TextField fullWidth value={formState.pilotDuration} onChange={handleTextChange('pilotDuration')} />

        <FieldLabel label="Renewal / Review Date:" />
        <TextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={formState.renewalReviewDate} onChange={handleTextChange('renewalReviewDate')} />

        <FieldLabel label="Explicitly Out of Scope for This Request:" />
        <TextField fullWidth multiline rows={2} value={formState.outOfScope} onChange={handleTextChange('outOfScope')} />

        <SubSectionHeader title="Business Objective" />
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={formState.businessObjective.revenue} onChange={handleNestedCheckbox('businessObjective', 'revenue')} />} label="Revenue generation" />
          <FormControlLabel control={<Checkbox checked={formState.businessObjective.costReduction} onChange={handleNestedCheckbox('businessObjective', 'costReduction')} />} label="Cost reduction" />
          <FormControlLabel control={<Checkbox checked={formState.businessObjective.riskMitigation} onChange={handleNestedCheckbox('businessObjective', 'riskMitigation')} />} label="Risk mitigation" />
          <FormControlLabel control={<Checkbox checked={formState.businessObjective.clientExperience} onChange={handleNestedCheckbox('businessObjective', 'clientExperience')} />} label="Client experience" />
          <FormControlLabel control={<Checkbox checked={formState.businessObjective.advisorExperience} onChange={handleNestedCheckbox('businessObjective', 'advisorExperience')} />} label="Advisor experience" />
          <FormControlLabel control={<Checkbox checked={formState.businessObjective.productivity} onChange={handleNestedCheckbox('businessObjective', 'productivity')} />} label="Productivity" />
          <FormControlLabel control={<Checkbox checked={formState.businessObjective.regulatoryCompliance} onChange={handleNestedCheckbox('businessObjective', 'regulatoryCompliance')} />} label="Regulatory / compliance support" />
        </FormGroup>
      </Paper>

      {/* SECTION 1 */}
      <SectionHeader
        title="SECTION 1 - USE CASE & WORKFLOW CLARITY"
        subtitle="All Submissions"
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <FieldLabel label="Describe end-to-end workflow:" />
        <TextField fullWidth multiline rows={3} value={formState.endToEndWorkflow} onChange={handleTextChange('endToEndWorkflow')} />

        <FieldLabel label="Trigger:" />
        <TextField fullWidth value={formState.trigger} onChange={handleTextChange('trigger')} />

        <FieldLabel label="Inputs:" />
        <TextField fullWidth multiline rows={2} value={formState.inputs} onChange={handleTextChange('inputs')} />

        <FieldLabel label="Processing:" />
        <TextField fullWidth multiline rows={2} value={formState.processing} onChange={handleTextChange('processing')} />

        <FieldLabel label="Outputs:" />
        <TextField fullWidth multiline rows={2} value={formState.outputs} onChange={handleTextChange('outputs')} />

        <FieldLabel label="Where outputs go next:" />
        <TextField fullWidth value={formState.outputsGoNext} onChange={handleTextChange('outputsGoNext')} />

        <SubSectionHeader title="Output Types Produced" />
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={formState.outputTypes.text} onChange={handleNestedCheckbox('outputTypes', 'text')} />} label="Text" />
          <FormControlLabel control={<Checkbox checked={formState.outputTypes.summary} onChange={handleNestedCheckbox('outputTypes', 'summary')} />} label="Summary" />
          <FormControlLabel control={<Checkbox checked={formState.outputTypes.extractedFields} onChange={handleNestedCheckbox('outputTypes', 'extractedFields')} />} label="Extracted fields" />
          <FormControlLabel control={<Checkbox checked={formState.outputTypes.documentDraft} onChange={handleNestedCheckbox('outputTypes', 'documentDraft')} />} label="Document draft" />
          <FormControlLabel control={<Checkbox checked={formState.outputTypes.code} onChange={handleNestedCheckbox('outputTypes', 'code')} />} label="Code" />
          <FormControlLabel control={<Checkbox checked={formState.outputTypes.image} onChange={handleNestedCheckbox('outputTypes', 'image')} />} label="Image" />
          <FormControlLabel control={<Checkbox checked={formState.outputTypes.decisionRecommendation} onChange={handleNestedCheckbox('outputTypes', 'decisionRecommendation')} />} label="Decision recommendation" />
          <FormControlLabel control={<Checkbox checked={formState.outputTypes.other} onChange={handleNestedCheckbox('outputTypes', 'other')} />} label="Other" />
        </FormGroup>
        {formState.outputTypes.other && (
          <TextField fullWidth label="Specify other output type" value={formState.outputTypesOther} onChange={handleTextChange('outputTypesOther')} sx={{ mt: 1 }} />
        )}

        <SubSectionHeader title="Users & Access" />
        <FieldLabel label="Who are the users?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.userType.internal} onChange={handleNestedCheckbox('userType', 'internal')} />} label="Internal" />
          <FormControlLabel control={<Checkbox checked={formState.userType.external} onChange={handleNestedCheckbox('userType', 'external')} />} label="External" />
          <FormControlLabel control={<Checkbox checked={formState.userType.both} onChange={handleNestedCheckbox('userType', 'both')} />} label="Both" />
        </FormGroup>

        <FieldLabel label="Exact audience and estimated count:" />
        <TextField fullWidth value={formState.exactAudience} onChange={handleTextChange('exactAudience')} />

        <FieldLabel label="Sharing method:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.sharingMethod.directShare} onChange={handleNestedCheckbox('sharingMethod', 'directShare')} />} label="Direct share" />
          <FormControlLabel control={<Checkbox checked={formState.sharingMethod.intranetLink} onChange={handleNestedCheckbox('sharingMethod', 'intranetLink')} />} label="Intranet link" />
          <FormControlLabel control={<Checkbox checked={formState.sharingMethod.embeddedInApp} onChange={handleNestedCheckbox('sharingMethod', 'embeddedInApp')} />} label="Embedded in application" />
          <FormControlLabel control={<Checkbox checked={formState.sharingMethod.other} onChange={handleNestedCheckbox('sharingMethod', 'other')} />} label="Other" />
        </FormGroup>
        {formState.sharingMethod.other && (
          <TextField fullWidth label="Specify other sharing method" value={formState.sharingMethodOther} onChange={handleTextChange('sharingMethodOther')} sx={{ mt: 1 }} />
        )}

        <FieldLabel label="User add/remove process:" />
        <TextField fullWidth value={formState.userAddRemoveProcess} onChange={handleTextChange('userAddRemoveProcess')} />

        <FieldLabel label="Approval workflow for adding new user groups:" />
        <TextField fullWidth value={formState.approvalWorkflow} onChange={handleTextChange('approvalWorkflow')} />

        <FieldLabel label="Do users already have permission to all surfaced datasets?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.usersHavePermission.yes} onChange={handleNestedCheckbox('usersHavePermission', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.usersHavePermission.no} onChange={handleNestedCheckbox('usersHavePermission', 'no')} />} label="No" />
        </FormGroup>

        <SubSectionHeader title="Decision Support & Human Oversight" />
        <FieldLabel label="Is output used for decision support in:" />
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={formState.decisionSupport.investment} onChange={handleNestedCheckbox('decisionSupport', 'investment')} />} label="Investment" />
          <FormControlLabel control={<Checkbox checked={formState.decisionSupport.trading} onChange={handleNestedCheckbox('decisionSupport', 'trading')} />} label="Trading" />
          <FormControlLabel control={<Checkbox checked={formState.decisionSupport.suitability} onChange={handleNestedCheckbox('decisionSupport', 'suitability')} />} label="Suitability" />
          <FormControlLabel control={<Checkbox checked={formState.decisionSupport.clientAdvice} onChange={handleNestedCheckbox('decisionSupport', 'clientAdvice')} />} label="Client advice" />
          <FormControlLabel control={<Checkbox checked={formState.decisionSupport.hr} onChange={handleNestedCheckbox('decisionSupport', 'hr')} />} label="HR" />
          <FormControlLabel control={<Checkbox checked={formState.decisionSupport.complianceApproval} onChange={handleNestedCheckbox('decisionSupport', 'complianceApproval')} />} label="Compliance approval" />
          <FormControlLabel control={<Checkbox checked={formState.decisionSupport.amlKyc} onChange={handleNestedCheckbox('decisionSupport', 'amlKyc')} />} label="AML/KYC" />
          <FormControlLabel control={<Checkbox checked={formState.decisionSupport.underwriting} onChange={handleNestedCheckbox('decisionSupport', 'underwriting')} />} label="Underwriting" />
          <FormControlLabel control={<Checkbox checked={formState.decisionSupport.otherRegulated} onChange={handleNestedCheckbox('decisionSupport', 'otherRegulated')} />} label="Other regulated decisions" />
          <FormControlLabel control={<Checkbox checked={formState.decisionSupport.internalProductivity} onChange={handleNestedCheckbox('decisionSupport', 'internalProductivity')} />} label="Internal productivity only" />
        </FormGroup>

        <FieldLabel label="Human-in-the-loop:" />
        <TextField fullWidth value={formState.humanInTheLoop} onChange={handleTextChange('humanInTheLoop')} />

        <FieldLabel label="Who reviews outputs?" />
        <TextField fullWidth value={formState.whoReviewsOutputs} onChange={handleTextChange('whoReviewsOutputs')} />

        <FieldLabel label="What must be validated?" />
        <TextField fullWidth value={formState.whatMustBeValidated} onChange={handleTextChange('whatMustBeValidated')} />

        <FieldLabel label="Stop-use / escalate condition:" />
        <TextField fullWidth value={formState.stopUseCondition} onChange={handleTextChange('stopUseCondition')} />

        <SubSectionHeader title="Output Reliance & Disclosure" />
        <FieldLabel label='Does the output include a disclaimer such as: "Responses are AI-generated and must be validated before use."' />
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={formState.disclaimerType.systemEnforced} onChange={handleNestedCheckbox('disclaimerType', 'systemEnforced')} />} label="Yes - System-enforced disclaimer" />
          <FormControlLabel control={<Checkbox checked={formState.disclaimerType.policyBased} onChange={handleNestedCheckbox('disclaimerType', 'policyBased')} />} label="Yes - Policy-based requirement" />
          <FormControlLabel control={<Checkbox checked={formState.disclaimerType.no} onChange={handleNestedCheckbox('disclaimerType', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="If client or advisor-facing, specify required disclosure language:" />
        <TextField fullWidth multiline rows={2} value={formState.disclosureLanguage} onChange={handleTextChange('disclosureLanguage')} />

        <FieldLabel label='Client- or Advisor facing or internal "non advisor" only?' />
        <TextField fullWidth value={formState.clientAdvisorFacing} onChange={handleTextChange('clientAdvisorFacing')} />

        <FieldLabel label="Harm scenario:" />
        <TextField fullWidth multiline rows={2} value={formState.harmScenario} onChange={handleTextChange('harmScenario')} />

        <FieldLabel label="Material impact if wrong:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.materialImpact.low} onChange={handleNestedCheckbox('materialImpact', 'low')} />} label="Low" />
          <FormControlLabel control={<Checkbox checked={formState.materialImpact.medium} onChange={handleNestedCheckbox('materialImpact', 'medium')} />} label="Medium" />
          <FormControlLabel control={<Checkbox checked={formState.materialImpact.high} onChange={handleNestedCheckbox('materialImpact', 'high')} />} label="High" />
        </FormGroup>

        <FieldLabel label="Worst-case outcome:" />
        <TextField fullWidth multiline rows={2} value={formState.worstCaseOutcome} onChange={handleTextChange('worstCaseOutcome')} />

        <FieldLabel label="Why GenAI vs traditional automation?" />
        <TextField fullWidth multiline rows={2} value={formState.whyGenAI} onChange={handleTextChange('whyGenAI')} />
      </Paper>

      {/* SECTION 2 */}
      <SectionHeader
        title="SECTION 2 - AI SYSTEM CLASSIFICATION"
        subtitle="All Submissions"
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <FieldLabel label="AI Type:" />
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={formState.aiType.traditionalML} onChange={handleNestedCheckbox('aiType', 'traditionalML')} />} label="Traditional ML" />
          <FormControlLabel control={<Checkbox checked={formState.aiType.generativeAI} onChange={handleNestedCheckbox('aiType', 'generativeAI')} />} label="Generative AI (LLM)" />
          <FormControlLabel control={<Checkbox checked={formState.aiType.ragBased} onChange={handleNestedCheckbox('aiType', 'ragBased')} />} label="RAG-based" />
          <FormControlLabel control={<Checkbox checked={formState.aiType.agentic} onChange={handleNestedCheckbox('aiType', 'agentic')} />} label="Agentic / Autonomous" />
          <FormControlLabel control={<Checkbox checked={formState.aiType.hybrid} onChange={handleNestedCheckbox('aiType', 'hybrid')} />} label="Hybrid" />
        </FormGroup>

        <FieldLabel label="Foundation model (if known):" />
        <TextField fullWidth value={formState.foundationModel} onChange={handleTextChange('foundationModel')} />

        <FieldLabel label="Model version:" />
        <TextField fullWidth value={formState.modelVersion} onChange={handleTextChange('modelVersion')} />

        <FieldLabel label="Role in AI Value Chain:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.roleInValueChain.provider} onChange={handleNestedCheckbox('roleInValueChain', 'provider')} />} label="Provider (we build)" />
          <FormControlLabel control={<Checkbox checked={formState.roleInValueChain.deployer} onChange={handleNestedCheckbox('roleInValueChain', 'deployer')} />} label="Deployer (vendor)" />
          <FormControlLabel control={<Checkbox checked={formState.roleInValueChain.both} onChange={handleNestedCheckbox('roleInValueChain', 'both')} />} label="Both" />
        </FormGroup>

        <FieldLabel label="Initial Risk Tier (Self-Assessment):" />
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={formState.initialRiskTier.low} onChange={handleNestedCheckbox('initialRiskTier', 'low')} />} label="Low (internal only)" />
          <FormControlLabel control={<Checkbox checked={formState.initialRiskTier.moderate} onChange={handleNestedCheckbox('initialRiskTier', 'moderate')} />} label="Moderate (client interaction with human review)" />
          <FormControlLabel control={<Checkbox checked={formState.initialRiskTier.high} onChange={handleNestedCheckbox('initialRiskTier', 'high')} />} label="High (material financial or HR decisioning)" />
          <FormControlLabel control={<Checkbox checked={formState.initialRiskTier.regulatorySensitive} onChange={handleNestedCheckbox('initialRiskTier', 'regulatorySensitive')} />} label="Regulatory-sensitive domain (AML/KYC, capital, compliance, conduct)" />
        </FormGroup>

        <FieldLabel label="Additional Risk Characteristics:" />
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={formState.additionalRiskCharacteristics.profiling} onChange={handleNestedCheckbox('additionalRiskCharacteristics', 'profiling')} />} label="Profiling individuals" />
          <FormControlLabel control={<Checkbox checked={formState.additionalRiskCharacteristics.automatedDecision} onChange={handleNestedCheckbox('additionalRiskCharacteristics', 'automatedDecision')} />} label="Automated decision-making" />
          <FormControlLabel control={<Checkbox checked={formState.additionalRiskCharacteristics.sensitiveData} onChange={handleNestedCheckbox('additionalRiskCharacteristics', 'sensitiveData')} />} label="Sensitive data processing" />
          <FormControlLabel control={<Checkbox checked={formState.additionalRiskCharacteristics.customerAdvisory} onChange={handleNestedCheckbox('additionalRiskCharacteristics', 'customerAdvisory')} />} label="Customer advisory outputs" />
        </FormGroup>
      </Paper>

      {/* OPTION A */}
      <SectionHeader
        title="OPTION A - CUSTOM GPT / CUSTOM IN-HOUSE APPLICATION"
        subtitle="Complete if selected"
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <SubSectionHeader title="A1. Model & Architecture" />

        <FieldLabel label="Model type:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a1ModelType.openSource} onChange={handleNestedCheckbox('a1ModelType', 'openSource')} />} label="Open-source" />
          <FormControlLabel control={<Checkbox checked={formState.a1ModelType.proprietaryAPI} onChange={handleNestedCheckbox('a1ModelType', 'proprietaryAPI')} />} label="Proprietary API (OpenAI, Anthropic, etc.)" />
          <FormControlLabel control={<Checkbox checked={formState.a1ModelType.other} onChange={handleNestedCheckbox('a1ModelType', 'other')} />} label="Other" />
        </FormGroup>

        <FieldLabel label="Access mode:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a1AccessMode.chatUI} onChange={handleNestedCheckbox('a1AccessMode', 'chatUI')} />} label="Chat UI" />
          <FormControlLabel control={<Checkbox checked={formState.a1AccessMode.api} onChange={handleNestedCheckbox('a1AccessMode', 'api')} />} label="API" />
          <FormControlLabel control={<Checkbox checked={formState.a1AccessMode.embedded} onChange={handleNestedCheckbox('a1AccessMode', 'embedded')} />} label="Embedded" />
        </FormGroup>

        <FormGroup>
          <FormControlLabel control={<Checkbox checked={formState.a1RagImplemented} onChange={handleCheckbox('a1RagImplemented')} />} label="RAG implemented" />
          <FormControlLabel control={<Checkbox checked={formState.a1AgenticOrchestration} onChange={handleCheckbox('a1AgenticOrchestration')} />} label="Agentic orchestration" />
        </FormGroup>

        <FieldLabel label="Fine-tuned?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a1FineTuned.yes} onChange={handleNestedCheckbox('a1FineTuned', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.a1FineTuned.no} onChange={handleNestedCheckbox('a1FineTuned', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="Training data source:" />
        <TextField fullWidth value={formState.a1TrainingDataSource} onChange={handleTextChange('a1TrainingDataSource')} />

        <FieldLabel label="Does data leave firm-controlled environment?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a1DataLeavesFirm.yes} onChange={handleNestedCheckbox('a1DataLeavesFirm', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.a1DataLeavesFirm.no} onChange={handleNestedCheckbox('a1DataLeavesFirm', 'no')} />} label="No" />
        </FormGroup>

        {formState.a1DataLeavesFirm.yes && (
          <>
            <FieldLabel label="If yes, describe safeguards:" />
            <TextField fullWidth multiline rows={2} value={formState.a1DataLeavesSafeguards} onChange={handleTextChange('a1DataLeavesSafeguards')} />
          </>
        )}

        <FieldLabel label="Integrations used:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a1Integrations.apis} onChange={handleNestedCheckbox('a1Integrations', 'apis')} />} label="APIs" />
          <FormControlLabel control={<Checkbox checked={formState.a1Integrations.rpa} onChange={handleNestedCheckbox('a1Integrations', 'rpa')} />} label="RPA" />
          <FormControlLabel control={<Checkbox checked={formState.a1Integrations.plugins} onChange={handleNestedCheckbox('a1Integrations', 'plugins')} />} label="Plugins" />
          <FormControlLabel control={<Checkbox checked={formState.a1Integrations.connectors} onChange={handleNestedCheckbox('a1Integrations', 'connectors')} />} label="Connectors" />
        </FormGroup>

        <FieldLabel label="Data flow and authentication summary:" />
        <TextField fullWidth multiline rows={2} value={formState.a1DataFlowSummary} onChange={handleTextChange('a1DataFlowSummary')} />

        <Divider sx={{ my: 3 }} />
        <SubSectionHeader title="A2. Knowledge & Data Governance" />

        <FieldLabel label="Knowledge sources:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a2KnowledgeSources.files} onChange={handleNestedCheckbox('a2KnowledgeSources', 'files')} />} label="Files" />
          <FormControlLabel control={<Checkbox checked={formState.a2KnowledgeSources.links} onChange={handleNestedCheckbox('a2KnowledgeSources', 'links')} />} label="Links" />
          <FormControlLabel control={<Checkbox checked={formState.a2KnowledgeSources.connectors} onChange={handleNestedCheckbox('a2KnowledgeSources', 'connectors')} />} label="Connectors" />
          <FormControlLabel control={<Checkbox checked={formState.a2KnowledgeSources.databases} onChange={handleNestedCheckbox('a2KnowledgeSources', 'databases')} />} label="Databases" />
          <FormControlLabel control={<Checkbox checked={formState.a2KnowledgeSources.apis} onChange={handleNestedCheckbox('a2KnowledgeSources', 'apis')} />} label="APIs" />
        </FormGroup>

        <FieldLabel label="Data types in prompts/uploads:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a2DataTypes.public} onChange={handleNestedCheckbox('a2DataTypes', 'public')} />} label="Public" />
          <FormControlLabel control={<Checkbox checked={formState.a2DataTypes.proprietary} onChange={handleNestedCheckbox('a2DataTypes', 'proprietary')} />} label="Proprietary" />
          <FormControlLabel control={<Checkbox checked={formState.a2DataTypes.clientConfidential} onChange={handleNestedCheckbox('a2DataTypes', 'clientConfidential')} />} label="Client confidential" />
          <FormControlLabel control={<Checkbox checked={formState.a2DataTypes.employeeConfidential} onChange={handleNestedCheckbox('a2DataTypes', 'employeeConfidential')} />} label="Employee confidential" />
        </FormGroup>

        <FieldLabel label="Examples:" />
        <TextField fullWidth multiline rows={2} value={formState.a2DataTypesExamples} onChange={handleTextChange('a2DataTypesExamples')} />

        <FieldLabel label="Is any data sent outside firm controls?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a2DataSentOutside.yes} onChange={handleNestedCheckbox('a2DataSentOutside', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.a2DataSentOutside.no} onChange={handleNestedCheckbox('a2DataSentOutside', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="DLP / guardrails:" />
        <TextField fullWidth value={formState.a2DlpGuardrails} onChange={handleTextChange('a2DlpGuardrails')} />

        <FieldLabel label="External-origin content licensing confirmed?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a2ExternalLicensing.yes} onChange={handleNestedCheckbox('a2ExternalLicensing', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.a2ExternalLicensing.no} onChange={handleNestedCheckbox('a2ExternalLicensing', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="Where knowledge stored? Who has access?" />
        <TextField fullWidth multiline rows={2} value={formState.a2KnowledgeStorage} onChange={handleTextChange('a2KnowledgeStorage')} />

        <FieldLabel label="Refresh frequency and approval owner:" />
        <TextField fullWidth value={formState.a2RefreshFrequency} onChange={handleTextChange('a2RefreshFrequency')} />

        <FieldLabel label="Prompt logging enabled?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a2PromptLogging.yes} onChange={handleNestedCheckbox('a2PromptLogging', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.a2PromptLogging.no} onChange={handleNestedCheckbox('a2PromptLogging', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="Retention period:" />
        <TextField fullWidth value={formState.a2RetentionPeriod} onChange={handleTextChange('a2RetentionPeriod')} />

        <FormGroup>
          <FormControlLabel control={<Checkbox checked={formState.a2Governance.dpia} onChange={handleNestedCheckbox('a2Governance', 'dpia')} />} label="DPIA completed" />
          <FormControlLabel control={<Checkbox checked={formState.a2Governance.dataMinimization} onChange={handleNestedCheckbox('a2Governance', 'dataMinimization')} />} label="Data minimization applied" />
          <FormControlLabel control={<Checkbox checked={formState.a2Governance.accessControls} onChange={handleNestedCheckbox('a2Governance', 'accessControls')} />} label="Access controls enforced" />
          <FormControlLabel control={<Checkbox checked={formState.a2Governance.dataRetention} onChange={handleNestedCheckbox('a2Governance', 'dataRetention')} />} label="Data retention defined" />
        </FormGroup>

        <FieldLabel label="Requester attestation:" />
        <FormControlLabel
          control={<Checkbox checked={formState.a2Attestation} onChange={handleCheckbox('a2Attestation')} />}
          label="I will not input non-public client, employee, or corporate data unless approved."
        />

        <Divider sx={{ my: 3 }} />
        <SubSectionHeader title="A3. Accuracy, Validation & Safety" />

        <FieldLabel label="Testing performed:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a3Testing.functional} onChange={handleNestedCheckbox('a3Testing', 'functional')} />} label="Functional" />
          <FormControlLabel control={<Checkbox checked={formState.a3Testing.hallucination} onChange={handleNestedCheckbox('a3Testing', 'hallucination')} />} label="Hallucination" />
          <FormControlLabel control={<Checkbox checked={formState.a3Testing.adversarial} onChange={handleNestedCheckbox('a3Testing', 'adversarial')} />} label="Adversarial" />
          <FormControlLabel control={<Checkbox checked={formState.a3Testing.bias} onChange={handleNestedCheckbox('a3Testing', 'bias')} />} label="Bias" />
          <FormControlLabel control={<Checkbox checked={formState.a3Testing.mrmValidation} onChange={handleNestedCheckbox('a3Testing', 'mrmValidation')} />} label="MRM validation" />
        </FormGroup>

        <FieldLabel label="How accuracy measured:" />
        <TextField fullWidth multiline rows={2} value={formState.a3AccuracyMeasurement} onChange={handleTextChange('a3AccuracyMeasurement')} />

        <FieldLabel label="Observed failure modes:" />
        <TextField fullWidth multiline rows={2} value={formState.a3FailureModes} onChange={handleTextChange('a3FailureModes')} />

        <FieldLabel label="Hallucination controls:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a3HallucinationControls.citations} onChange={handleNestedCheckbox('a3HallucinationControls', 'citations')} />} label="Citations" />
          <FormControlLabel control={<Checkbox checked={formState.a3HallucinationControls.internalDocs} onChange={handleNestedCheckbox('a3HallucinationControls', 'internalDocs')} />} label="Links to internal docs" />
          <FormControlLabel control={<Checkbox checked={formState.a3HallucinationControls.manualVerification} onChange={handleNestedCheckbox('a3HallucinationControls', 'manualVerification')} />} label="Manual verification" />
        </FormGroup>

        <FieldLabel label="Refusal conditions:" />
        <TextField fullWidth value={formState.a3RefusalConditions} onChange={handleTextChange('a3RefusalConditions')} />

        <FieldLabel label="Data exfiltration controls:" />
        <TextField fullWidth value={formState.a3DataExfiltrationControls} onChange={handleTextChange('a3DataExfiltrationControls')} />

        <FieldLabel label="Incident tracking & escalation:" />
        <TextField fullWidth value={formState.a3IncidentTracking} onChange={handleTextChange('a3IncidentTracking')} />

        <FieldLabel label="Ongoing monitoring:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a3OngoingMonitoring.drift} onChange={handleNestedCheckbox('a3OngoingMonitoring', 'drift')} />} label="Drift" />
          <FormControlLabel control={<Checkbox checked={formState.a3OngoingMonitoring.kpis} onChange={handleNestedCheckbox('a3OngoingMonitoring', 'kpis')} />} label="KPIs" />
          <FormControlLabel control={<Checkbox checked={formState.a3OngoingMonitoring.logging} onChange={handleNestedCheckbox('a3OngoingMonitoring', 'logging')} />} label="Logging" />
          <FormControlLabel control={<Checkbox checked={formState.a3OngoingMonitoring.incidentEscalation} onChange={handleNestedCheckbox('a3OngoingMonitoring', 'incidentEscalation')} />} label="Incident escalation" />
        </FormGroup>

        <Divider sx={{ my: 3 }} />
        <SubSectionHeader title="A4. Security & Ethics" />
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={formState.a4PromptInjectionTesting} onChange={handleCheckbox('a4PromptInjectionTesting')} />} label="Prompt injection testing" />
          <FormControlLabel control={<Checkbox checked={formState.a4OutputFiltering} onChange={handleCheckbox('a4OutputFiltering')} />} label="Output filtering" />
          <FormControlLabel control={<Checkbox checked={formState.a4CybersecurityReview} onChange={handleCheckbox('a4CybersecurityReview')} />} label="Cybersecurity review" />
          <FormControlLabel control={<Checkbox checked={formState.a4KillSwitch} onChange={handleCheckbox('a4KillSwitch')} />} label="Kill switch" />
        </FormGroup>

        <FieldLabel label="Sensitive domains involved:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a4SensitiveDomains.credit} onChange={handleNestedCheckbox('a4SensitiveDomains', 'credit')} />} label="Credit" />
          <FormControlLabel control={<Checkbox checked={formState.a4SensitiveDomains.pricing} onChange={handleNestedCheckbox('a4SensitiveDomains', 'pricing')} />} label="Pricing" />
          <FormControlLabel control={<Checkbox checked={formState.a4SensitiveDomains.underwriting} onChange={handleNestedCheckbox('a4SensitiveDomains', 'underwriting')} />} label="Underwriting" />
          <FormControlLabel control={<Checkbox checked={formState.a4SensitiveDomains.amlKyc} onChange={handleNestedCheckbox('a4SensitiveDomains', 'amlKyc')} />} label="AML/KYC" />
          <FormControlLabel control={<Checkbox checked={formState.a4SensitiveDomains.hr} onChange={handleNestedCheckbox('a4SensitiveDomains', 'hr')} />} label="HR" />
          <FormControlLabel control={<Checkbox checked={formState.a4SensitiveDomains.profiling} onChange={handleNestedCheckbox('a4SensitiveDomains', 'profiling')} />} label="Profiling" />
        </FormGroup>

        <FieldLabel label="Bias testing completed?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a4BiasTesting.yes} onChange={handleNestedCheckbox('a4BiasTesting', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.a4BiasTesting.no} onChange={handleNestedCheckbox('a4BiasTesting', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="Ethics Council review required?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a4EthicsCouncil.yes} onChange={handleNestedCheckbox('a4EthicsCouncil', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.a4EthicsCouncil.no} onChange={handleNestedCheckbox('a4EthicsCouncil', 'no')} />} label="No" />
        </FormGroup>

        <Divider sx={{ my: 3 }} />
        <SubSectionHeader title="A5. Deployment & Operations" />

        <FieldLabel label="Owner responsibilities:" />
        <TextField fullWidth multiline rows={2} value={formState.a5OwnerResponsibilities} onChange={handleTextChange('a5OwnerResponsibilities')} />

        <FieldLabel label="Review frequency:" />
        <TextField fullWidth value={formState.a5ReviewFrequency} onChange={handleTextChange('a5ReviewFrequency')} />

        <FieldLabel label="Change triggers for re-review:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.a5ChangeTriggers.newData} onChange={handleNestedCheckbox('a5ChangeTriggers', 'newData')} />} label="New data" />
          <FormControlLabel control={<Checkbox checked={formState.a5ChangeTriggers.newUsers} onChange={handleNestedCheckbox('a5ChangeTriggers', 'newUsers')} />} label="New users" />
          <FormControlLabel control={<Checkbox checked={formState.a5ChangeTriggers.newWorkflow} onChange={handleNestedCheckbox('a5ChangeTriggers', 'newWorkflow')} />} label="New workflow" />
          <FormControlLabel control={<Checkbox checked={formState.a5ChangeTriggers.modelChange} onChange={handleNestedCheckbox('a5ChangeTriggers', 'modelChange')} />} label="Model change" />
          <FormControlLabel control={<Checkbox checked={formState.a5ChangeTriggers.featureChange} onChange={handleNestedCheckbox('a5ChangeTriggers', 'featureChange')} />} label="Feature change" />
        </FormGroup>

        <FieldLabel label="Decommissioning plan:" />
        <TextField fullWidth multiline rows={2} value={formState.a5DecommissioningPlan} onChange={handleTextChange('a5DecommissioningPlan')} />

        <FieldLabel label="Training & communications plan:" />
        <TextField fullWidth multiline rows={2} value={formState.a5TrainingPlan} onChange={handleTextChange('a5TrainingPlan')} />

        <FieldLabel label="Success metrics:" />
        <TextField fullWidth multiline rows={2} value={formState.a5SuccessMetrics} onChange={handleTextChange('a5SuccessMetrics')} />
      </Paper>

      {/* OPTION B */}
      <SectionHeader
        title="OPTION B - VENDOR TOOL (External SaaS / Platform)"
        subtitle="Complete if selected"
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <SubSectionHeader title="B1. Vendor Overview" />

        <FieldLabel label="Vendor Name:" />
        <TextField fullWidth value={formState.b1VendorName} onChange={handleTextChange('b1VendorName')} />

        <FieldLabel label="Product Name:" />
        <TextField fullWidth value={formState.b1ProductName} onChange={handleTextChange('b1ProductName')} />

        <FieldLabel label="Feature Name:" />
        <TextField fullWidth value={formState.b1FeatureName} onChange={handleTextChange('b1FeatureName')} />

        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b1VendorStatus.newVendor} onChange={handleNestedCheckbox('b1VendorStatus', 'newVendor')} />} label="New vendor" />
          <FormControlLabel control={<Checkbox checked={formState.b1VendorStatus.existingVendor} onChange={handleNestedCheckbox('b1VendorStatus', 'existingVendor')} />} label="Existing vendor" />
        </FormGroup>

        <FieldLabel label="AI embedded?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b1AIEmbedded.yes} onChange={handleNestedCheckbox('b1AIEmbedded', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.b1AIEmbedded.no} onChange={handleNestedCheckbox('b1AIEmbedded', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="Underlying model:" />
        <TextField fullWidth value={formState.b1UnderlyingModel} onChange={handleTextChange('b1UnderlyingModel')} />

        <FieldLabel label="Model version:" />
        <TextField fullWidth value={formState.b1ModelVersion} onChange={handleTextChange('b1ModelVersion')} />

        <FieldLabel label="Access mode:" />
        <TextField fullWidth value={formState.b1AccessMode} onChange={handleTextChange('b1AccessMode')} />

        <FieldLabel label="Vendor trains on firm data?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b1VendorTrains.yes} onChange={handleNestedCheckbox('b1VendorTrains', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.b1VendorTrains.no} onChange={handleNestedCheckbox('b1VendorTrains', 'no')} />} label="No" />
          <FormControlLabel control={<Checkbox checked={formState.b1VendorTrains.optedOut} onChange={handleNestedCheckbox('b1VendorTrains', 'optedOut')} />} label="Contractually opted out" />
        </FormGroup>

        <FieldLabel label="Opt-in required per GenAI feature?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b1OptInRequired.yes} onChange={handleNestedCheckbox('b1OptInRequired', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.b1OptInRequired.no} onChange={handleNestedCheckbox('b1OptInRequired', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="GenAI features enabled by default?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b1GenAIDefault.yes} onChange={handleNestedCheckbox('b1GenAIDefault', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.b1GenAIDefault.no} onChange={handleNestedCheckbox('b1GenAIDefault', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="Sandbox available?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b1Sandbox.yes} onChange={handleNestedCheckbox('b1Sandbox', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.b1Sandbox.no} onChange={handleNestedCheckbox('b1Sandbox', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="Notification of major model/feature changes?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b1ChangeNotification.yes} onChange={handleNestedCheckbox('b1ChangeNotification', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.b1ChangeNotification.no} onChange={handleNestedCheckbox('b1ChangeNotification', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="Process to assess new features before enablement:" />
        <TextField fullWidth multiline rows={2} value={formState.b1AssessmentProcess} onChange={handleTextChange('b1AssessmentProcess')} />

        <Divider sx={{ my: 3 }} />
        <SubSectionHeader title="B2. Data & AI Component Details" />

        <FieldLabel label="Specific firm data used:" />
        <TextField fullWidth multiline rows={2} value={formState.b2SpecificData} onChange={handleTextChange('b2SpecificData')} />

        <FieldLabel label="Prompt/upload data types:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b2DataTypes.public} onChange={handleNestedCheckbox('b2DataTypes', 'public')} />} label="Public" />
          <FormControlLabel control={<Checkbox checked={formState.b2DataTypes.proprietary} onChange={handleNestedCheckbox('b2DataTypes', 'proprietary')} />} label="Proprietary" />
          <FormControlLabel control={<Checkbox checked={formState.b2DataTypes.clientConfidential} onChange={handleNestedCheckbox('b2DataTypes', 'clientConfidential')} />} label="Client confidential" />
          <FormControlLabel control={<Checkbox checked={formState.b2DataTypes.employeeConfidential} onChange={handleNestedCheckbox('b2DataTypes', 'employeeConfidential')} />} label="Employee confidential" />
        </FormGroup>

        <FieldLabel label="Is data sent to external LLM provider?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b2DataSentExternal.yes} onChange={handleNestedCheckbox('b2DataSentExternal', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.b2DataSentExternal.no} onChange={handleNestedCheckbox('b2DataSentExternal', 'no')} />} label="No" />
        </FormGroup>

        {formState.b2DataSentExternal.yes && (
          <>
            <FieldLabel label="If yes, describe:" />
            <TextField fullWidth multiline rows={2} value={formState.b2DataSentDescription} onChange={handleTextChange('b2DataSentDescription')} />
          </>
        )}

        <FieldLabel label="Data protection:" />
        <TextField fullWidth value={formState.b2DataProtection} onChange={handleTextChange('b2DataProtection')} />

        <FieldLabel label="Retention:" />
        <TextField fullWidth value={formState.b2Retention} onChange={handleTextChange('b2Retention')} />

        <FieldLabel label="Incident notification:" />
        <TextField fullWidth value={formState.b2IncidentNotification} onChange={handleTextChange('b2IncidentNotification')} />

        <FieldLabel label="Audit rights:" />
        <TextField fullWidth value={formState.b2AuditRights} onChange={handleTextChange('b2AuditRights')} />

        <FieldLabel label="Is training disabled contractually and technically?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b2TrainingDisabled.yes} onChange={handleNestedCheckbox('b2TrainingDisabled', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.b2TrainingDisabled.no} onChange={handleNestedCheckbox('b2TrainingDisabled', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="Logical/physical data isolation:" />
        <TextField fullWidth value={formState.b2DataIsolation} onChange={handleTextChange('b2DataIsolation')} />

        <FieldLabel label="Can other customers' data influence outputs?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b2OtherCustomersInfluence.yes} onChange={handleNestedCheckbox('b2OtherCustomersInfluence', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.b2OtherCustomersInfluence.no} onChange={handleNestedCheckbox('b2OtherCustomersInfluence', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="Retention policy:" />
        <TextField fullWidth label="Firm data" value={formState.b2RetentionFirmData} onChange={handleTextChange('b2RetentionFirmData')} sx={{ mb: 1 }} />
        <TextField fullWidth label="User inputs" value={formState.b2RetentionUserInputs} onChange={handleTextChange('b2RetentionUserInputs')} sx={{ mb: 1 }} />
        <TextField fullWidth label="Outputs" value={formState.b2RetentionOutputs} onChange={handleTextChange('b2RetentionOutputs')} />

        <FieldLabel label="Retention configurable?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b2RetentionConfigurable.yes} onChange={handleNestedCheckbox('b2RetentionConfigurable', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.b2RetentionConfigurable.no} onChange={handleNestedCheckbox('b2RetentionConfigurable', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="Cross-border assessment completed?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b2CrossBorder.yes} onChange={handleNestedCheckbox('b2CrossBorder', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.b2CrossBorder.no} onChange={handleNestedCheckbox('b2CrossBorder', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="DLP and guardrails:" />
        <TextField fullWidth value={formState.b2DlpGuardrails} onChange={handleTextChange('b2DlpGuardrails')} />

        <FieldLabel label="Requester attestation:" />
        <FormControlLabel
          control={<Checkbox checked={formState.b2Attestation} onChange={handleCheckbox('b2Attestation')} />}
          label="I will not input non-public client, employee, or corporate data unless approved."
        />

        <Divider sx={{ my: 3 }} />
        <SubSectionHeader title="B3. Third-Party Risk & Dependencies" />
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={formState.b3GovernanceReviewed} onChange={handleCheckbox('b3GovernanceReviewed')} />} label="AI governance documentation reviewed" />
          <FormControlLabel control={<Checkbox checked={formState.b3Soc2Verified} onChange={handleCheckbox('b3Soc2Verified')} />} label="SOC 2 / ISO verified" />
          <FormControlLabel control={<Checkbox checked={formState.b3AuditRight} onChange={handleCheckbox('b3AuditRight')} />} label="Right to audit included" />
          <FormControlLabel control={<Checkbox checked={formState.b3SubProcessors} onChange={handleCheckbox('b3SubProcessors')} />} label="Sub-processors disclosed" />
          <FormControlLabel control={<Checkbox checked={formState.b3ModelUpdateClause} onChange={handleCheckbox('b3ModelUpdateClause')} />} label="Model update notification clause included" />
        </FormGroup>

        <FieldLabel label="Nth-party dependencies:" />
        <TextField fullWidth multiline rows={2} value={formState.b3NthPartyDependencies} onChange={handleTextChange('b3NthPartyDependencies')} />

        <Divider sx={{ my: 3 }} />
        <SubSectionHeader title="B4. Accuracy, Safety & Security" />

        <FieldLabel label="POC/Pilot observations:" />
        <TextField fullWidth multiline rows={2} value={formState.b4PocObservations} onChange={handleTextChange('b4PocObservations')} />

        <FieldLabel label="Testing results & accuracy measurement:" />
        <TextField fullWidth multiline rows={2} value={formState.b4TestingResults} onChange={handleTextChange('b4TestingResults')} />

        <FieldLabel label="Failure modes observed:" />
        <TextField fullWidth multiline rows={2} value={formState.b4FailureModes} onChange={handleTextChange('b4FailureModes')} />

        <FieldLabel label="Hallucination controls:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b4HallucinationControls.citations} onChange={handleNestedCheckbox('b4HallucinationControls', 'citations')} />} label="Citations" />
          <FormControlLabel control={<Checkbox checked={formState.b4HallucinationControls.internalLinking} onChange={handleNestedCheckbox('b4HallucinationControls', 'internalLinking')} />} label="Internal linking" />
          <FormControlLabel control={<Checkbox checked={formState.b4HallucinationControls.verificationRequired} onChange={handleNestedCheckbox('b4HallucinationControls', 'verificationRequired')} />} label="Verification required" />
        </FormGroup>

        <FieldLabel label="Refusal and escalation conditions:" />
        <TextField fullWidth value={formState.b4RefusalConditions} onChange={handleTextChange('b4RefusalConditions')} />

        <FieldLabel label="Vendor protections against:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b4VendorProtections.promptInjection} onChange={handleNestedCheckbox('b4VendorProtections', 'promptInjection')} />} label="Prompt injection" />
          <FormControlLabel control={<Checkbox checked={formState.b4VendorProtections.dataExfiltration} onChange={handleNestedCheckbox('b4VendorProtections', 'dataExfiltration')} />} label="Data exfiltration" />
          <FormControlLabel control={<Checkbox checked={formState.b4VendorProtections.modelInversion} onChange={handleNestedCheckbox('b4VendorProtections', 'modelInversion')} />} label="Model inversion" />
          <FormControlLabel control={<Checkbox checked={formState.b4VendorProtections.apiAbuse} onChange={handleNestedCheckbox('b4VendorProtections', 'apiAbuse')} />} label="API abuse" />
        </FormGroup>

        <FieldLabel label="Logging (what, where, who has access):" />
        <TextField fullWidth multiline rows={2} value={formState.b4Logging} onChange={handleTextChange('b4Logging')} />

        <FieldLabel label="Monitoring for output drift?" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b4DriftMonitoring.yes} onChange={handleNestedCheckbox('b4DriftMonitoring', 'yes')} />} label="Yes" />
          <FormControlLabel control={<Checkbox checked={formState.b4DriftMonitoring.no} onChange={handleNestedCheckbox('b4DriftMonitoring', 'no')} />} label="No" />
        </FormGroup>

        <FieldLabel label="Incident readiness process:" />
        <TextField fullWidth multiline rows={2} value={formState.b4IncidentReadiness} onChange={handleTextChange('b4IncidentReadiness')} />

        <FieldLabel label="Feature enabled:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b4FeatureEnabled.global} onChange={handleNestedCheckbox('b4FeatureEnabled', 'global')} />} label="Global" />
          <FormControlLabel control={<Checkbox checked={formState.b4FeatureEnabled.roleBased} onChange={handleNestedCheckbox('b4FeatureEnabled', 'roleBased')} />} label="Role-based" />
        </FormGroup>

        <Divider sx={{ my: 3 }} />
        <SubSectionHeader title="B5. Deployment & Ongoing Operations" />

        <FieldLabel label="Operating model & ownership:" />
        <TextField fullWidth multiline rows={2} value={formState.b5OperatingModel} onChange={handleTextChange('b5OperatingModel')} />

        <FieldLabel label="Review frequency:" />
        <TextField fullWidth value={formState.b5ReviewFrequency} onChange={handleTextChange('b5ReviewFrequency')} />

        <FieldLabel label="Change triggers for re-review:" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.b5ChangeTriggers.newData} onChange={handleNestedCheckbox('b5ChangeTriggers', 'newData')} />} label="New data" />
          <FormControlLabel control={<Checkbox checked={formState.b5ChangeTriggers.newUsers} onChange={handleNestedCheckbox('b5ChangeTriggers', 'newUsers')} />} label="New users" />
          <FormControlLabel control={<Checkbox checked={formState.b5ChangeTriggers.newUseCase} onChange={handleNestedCheckbox('b5ChangeTriggers', 'newUseCase')} />} label="New use case" />
          <FormControlLabel control={<Checkbox checked={formState.b5ChangeTriggers.vendorFeatureChange} onChange={handleNestedCheckbox('b5ChangeTriggers', 'vendorFeatureChange')} />} label="Vendor feature change" />
          <FormControlLabel control={<Checkbox checked={formState.b5ChangeTriggers.modelChange} onChange={handleNestedCheckbox('b5ChangeTriggers', 'modelChange')} />} label="Model change" />
        </FormGroup>

        <FieldLabel label="Decommissioning plan:" />
        <TextField fullWidth multiline rows={2} value={formState.b5DecommissioningPlan} onChange={handleTextChange('b5DecommissioningPlan')} />

        <FieldLabel label="Training & communications plan:" />
        <TextField fullWidth multiline rows={2} value={formState.b5TrainingPlan} onChange={handleTextChange('b5TrainingPlan')} />

        <FieldLabel label="Success metrics:" />
        <TextField fullWidth multiline rows={2} value={formState.b5SuccessMetrics} onChange={handleTextChange('b5SuccessMetrics')} />
      </Paper>

      {/* SECTION 3 */}
      <SectionHeader
        title="SECTION 3 - INTELLECTUAL PROPERTY"
        subtitle="All Submissions"
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={formState.s3VendorIndemnification} onChange={handleCheckbox('s3VendorIndemnification')} />} label="Vendor indemnification (if applicable)" />
          <FormControlLabel control={<Checkbox checked={formState.s3PlagiarismControls} onChange={handleCheckbox('s3PlagiarismControls')} />} label="Plagiarism controls" />
          <FormControlLabel control={<Checkbox checked={formState.s3DataLeakageProtections} onChange={handleCheckbox('s3DataLeakageProtections')} />} label="Confidential data leakage protections" />
          <FormControlLabel control={<Checkbox checked={formState.s3StaffTrained} onChange={handleCheckbox('s3StaffTrained')} />} label="Staff trained on safe prompt usage" />
        </FormGroup>
      </Paper>

      {/* SECTION 4 */}
      <SectionHeader
        title="SECTION 4 - WORKFORCE IMPACT"
        subtitle="All Submissions"
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={formState.s4WorkforceImpact} onChange={handleCheckbox('s4WorkforceImpact')} />} label="Workforce impact assessed" />
          <FormControlLabel control={<Checkbox checked={formState.s4HRConsulted} onChange={handleCheckbox('s4HRConsulted')} />} label="HR consulted" />
          <FormControlLabel control={<Checkbox checked={formState.s4AILiteracyTraining} onChange={handleCheckbox('s4AILiteracyTraining')} />} label="AI literacy training delivered" />
          <FormControlLabel control={<Checkbox checked={formState.s4AccountabilityDocumented} onChange={handleCheckbox('s4AccountabilityDocumented')} />} label="Accountability documented" />
        </FormGroup>
      </Paper>

      {/* SECTION 5 */}
      <SectionHeader
        title="SECTION 5 - REGULATORY MAPPING"
        subtitle="All Submissions"
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <FieldLabel label="Jurisdictions impacted:" />
        <TextField fullWidth value={formState.s5Jurisdictions} onChange={handleTextChange('s5Jurisdictions')} />

        <FormGroup sx={{ mt: 2 }}>
          <FormControlLabel control={<Checkbox checked={formState.s5EuAiAct} onChange={handleCheckbox('s5EuAiAct')} />} label="EU AI Act assessed" />
          <FormControlLabel control={<Checkbox checked={formState.s5Gdpr} onChange={handleCheckbox('s5Gdpr')} />} label="GDPR reviewed" />
          <FormControlLabel control={<Checkbox checked={formState.s5FinancialRegulator} onChange={handleCheckbox('s5FinancialRegulator')} />} label="Applicable financial regulator reviewed" />
          <FormControlLabel control={<Checkbox checked={formState.s5HighRisk} onChange={handleCheckbox('s5HighRisk')} />} label="High-risk classification triggered" />
        </FormGroup>

        {formState.s5HighRisk && (
          <>
            <FieldLabel label="If yes, specify:" />
            <TextField fullWidth value={formState.s5HighRiskSpecify} onChange={handleTextChange('s5HighRiskSpecify')} />
          </>
        )}
      </Paper>

      {/* SECTION 6 */}
      <SectionHeader
        title="SECTION 6 - BUSINESS RISK DECLARATION"
        subtitle="Self-Assessment"
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <FieldLabel label="Residual Risk Level (Business Assessment):" />
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={formState.s6ResidualRisk.low} onChange={handleNestedCheckbox('s6ResidualRisk', 'low')} />} label="Low" />
          <FormControlLabel control={<Checkbox checked={formState.s6ResidualRisk.moderate} onChange={handleNestedCheckbox('s6ResidualRisk', 'moderate')} />} label="Moderate" />
          <FormControlLabel control={<Checkbox checked={formState.s6ResidualRisk.elevated} onChange={handleNestedCheckbox('s6ResidualRisk', 'elevated')} />} label="Elevated" />
          <FormControlLabel control={<Checkbox checked={formState.s6ResidualRisk.high} onChange={handleNestedCheckbox('s6ResidualRisk', 'high')} />} label="High" />
        </FormGroup>

        <FieldLabel label="Key Risks:" />
        <TextField fullWidth multiline rows={3} value={formState.s6KeyRisks} onChange={handleTextChange('s6KeyRisks')} />

        <FieldLabel label="Mitigations:" />
        <TextField fullWidth multiline rows={3} value={formState.s6Mitigations} onChange={handleTextChange('s6Mitigations')} />

        <SubSectionHeader title="Business Owner Attestation" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          I confirm this submission accurately reflects scope, controls, and data usage.
        </Typography>

        <FieldLabel label="Name:" />
        <TextField fullWidth value={formState.s6AttestationName} onChange={handleTextChange('s6AttestationName')} />

        <FieldLabel label="Title:" />
        <TextField fullWidth value={formState.s6AttestationTitle} onChange={handleTextChange('s6AttestationTitle')} />

        <FieldLabel label="Signature:" />
        <TextField fullWidth value={formState.s6AttestationSignature} onChange={handleTextChange('s6AttestationSignature')} />

        <FieldLabel label="Date:" />
        <TextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={formState.s6AttestationDate} onChange={handleTextChange('s6AttestationDate')} />
      </Paper>

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
        >
          Submit
        </Button>
      </Box>

      <Snackbar
        open={submitSuccess}
        autoHideDuration={6000}
        onClose={() => setSubmitSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSubmitSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Form submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SampleForm;
