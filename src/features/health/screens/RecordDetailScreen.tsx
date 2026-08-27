// Health Records Module - Record Detail Screen (Dynamic per type)

import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useHealthRecord } from '../hooks';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { AttachmentThumbnail } from '../components/AttachmentThumbnail';
import { HealthRecord, RECORD_TYPE_LABELS } from '../types';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

const RECORD_TYPE_COLORS: Record<string, string> = {
  lab_report: '#3B82F6',
  prescription: '#2D6A4F',
  consultation: '#7C3AED',
  vaccination: '#06B6D4',
  allergy: '#F97316',
};

interface RecordDetailScreenProps {
  route: {
    params: { recordId: string };
  };
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params: Record<string, unknown>) => void;
  };
}

export function RecordDetailScreen({ route, navigation }: RecordDetailScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { recordId } = route.params;
  const { data: record, isLoading, isError } = useHealthRecord(recordId);

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.action.primary} />
        <AppText variant="body" style={{ marginTop: spacing.md, color: colors.text.secondary }}>
          Loading record...
        </AppText>
      </View>
    );
  }

  if (isError || !record) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <AppText variant="h3" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
          Record not found
        </AppText>
        <Button title="Go Back" variant="primary" size="medium" onPress={navigation.goBack} />
      </View>
    );
  }

  const typeColor = RECORD_TYPE_COLORS[record.type] ?? '#6B7280';
  const date = new Date(record.occurredAt);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.topBar, { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm, backgroundColor: colors.surface.default, borderBottomColor: colors.border.light, borderBottomWidth: 1 }]}>
        <TouchableOpacity onPress={navigation.goBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <AppText variant="h2" style={{ color: colors.text.primary }}>←</AppText>
        </TouchableOpacity>
        <View style={styles.topBarRight}>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ padding: spacing.sm }}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>⤴</AppText>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ padding: spacing.sm }}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>⬇</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.typeBadge, { alignSelf: 'flex-start', backgroundColor: typeColor + '15', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 4, marginBottom: spacing.sm }]}>
          <AppText variant="caption" style={{ color: typeColor, fontWeight: '600' }}>
            {RECORD_TYPE_LABELS[record.type]}
          </AppText>
        </View>

        <AppText variant="h2" style={{ fontSize: 22, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.sm }}>
          {record.title}
        </AppText>

        <View style={styles.metaRow}>
          <AppText variant="body" style={{ color: colors.text.secondary }}>
            {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </AppText>
          <AppText variant="body" style={{ color: colors.text.tertiary, marginHorizontal: spacing.sm }}>•</AppText>
          <AppText variant="body" style={{ color: colors.text.secondary }}>
            Dr. {record.metadata.doctor ?? 'Dr. Priya Sharma'}
          </AppText>
          <AppText variant="body" style={{ color: colors.text.tertiary, marginHorizontal: spacing.sm }}>•</AppText>
          <AppText variant="body" style={{ color: colors.text.secondary }}>
            {record.metadata.facility ?? 'Amrutam Wellness Center'}
          </AppText>
        </View>

        {record.type === 'lab_report' && <LabReportContent record={record} colors={colors} spacing={spacing} />}
        {record.type === 'prescription' && <PrescriptionContent record={record} colors={colors} spacing={spacing} />}
        {record.type === 'consultation' && <ConsultationContent record={record} colors={colors} spacing={spacing} />}
        {record.type === 'vaccination' && <VaccinationContent record={record} colors={colors} spacing={spacing} />}
        {record.type === 'allergy' && <AllergyContent record={record} colors={colors} spacing={spacing} />}

        {record.attachments.length > 0 && (
          <View style={[styles.section, { marginTop: spacing.xl }]}>
            <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.md, textTransform: 'uppercase' }}>
              Attachments
            </AppText>
            {record.attachments.map((att) => (
              <TouchableOpacity
                key={att.id}
                onPress={() => navigation.navigate('AttachmentPreview', { attachment: att })}
                activeOpacity={0.7}
                style={[styles.attachmentCard, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center' }]}
              >
                <View style={[styles.attachmentIcon, { backgroundColor: att.mimeType === 'application/pdf' ? colors.status.error + '20' : colors.status.info + '20', width: 48, height: 48, borderRadius: spacing.sm, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md }]}>
                  <AppText variant="h3">{att.mimeType === 'application/pdf' ? '📄' : '🖼️'}</AppText>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="body" style={{ color: colors.text.primary, fontWeight: '600' }} numberOfLines={1}>
                    {att.name}
                  </AppText>
                  <AppText variant="caption" style={{ color: colors.text.secondary, marginTop: 2 }}>
                    {att.mimeType === 'application/pdf' ? 'PDF' : 'Image'} · {att.sizeBytes ? `${(att.sizeBytes / 1024).toFixed(1)} KB` : 'Unknown size'}
                  </AppText>
                </View>
                <AppText variant="h3" style={{ color: colors.text.tertiary }}>›</AppText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

function LabReportContent({ record, colors, spacing }: { record: HealthRecord; colors: ReturnType<typeof useThemeColors>; spacing: ReturnType<typeof useThemeSpacing> }) {
  const labTests = [
    { name: 'Hemoglobin', result: '14.2 g/dL', normal: true, reference: '12.0-16.0 g/dL' },
    { name: 'WBC Count', result: '11,200 /µL', normal: false, reference: '4,000-11,000 /µL' },
    { name: 'RBC Count', result: '5.1 M/µL', normal: true, reference: '4.5-5.5 M/µL' },
    { name: 'Platelet Count', result: '2,45,000 /µL', normal: true, reference: '1,50,000-4,00,000 /µL' },
    { name: 'Hematocrit', result: '42.3%', normal: true, reference: '36.0-46.0%' },
    { name: 'MCV', result: '82.9 fL', normal: true, reference: '80.0-100.0 fL' },
  ];

  return (
    <>
      <View style={[styles.section, { marginTop: spacing.xl }]}>
        <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.md, textTransform: 'uppercase' }}>
          Results
        </AppText>
        <View style={[styles.tableCard, { backgroundColor: colors.surface.default, borderRadius: spacing.md, overflow: 'hidden' }]}>
          <View style={[styles.tableHeader, { backgroundColor: colors.background.secondary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row' }]}>
            <AppText variant="label" style={{ flex: 2, color: colors.text.secondary, textTransform: 'uppercase' }}>Test</AppText>
            <AppText variant="label" style={{ flex: 1.5, color: colors.text.secondary, textTransform: 'uppercase' }}>Result</AppText>
            <AppText variant="label" style={{ flex: 1.5, color: colors.text.secondary, textTransform: 'uppercase', textAlign: 'right' }}>Reference</AppText>
          </View>
          {labTests.map((test, idx) => (
            <View
              key={test.name}
              style={[styles.tableRow, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', borderBottomWidth: idx < labTests.length - 1 ? 1 : 0, borderBottomColor: colors.border.light }]}
            >
              <AppText variant="body" style={{ flex: 2, color: colors.text.primary }}>{test.name}</AppText>
              <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
                <AppText variant="body" style={{ color: test.normal ? '#2D6A4F' : '#F97316', fontWeight: '600' }}>
                  {test.result}
                </AppText>
                {!test.normal && (
                  <AppText variant="caption" style={{ color: '#F97316', marginLeft: 4 }}>▲</AppText>
                )}
              </View>
              <AppText variant="body" style={{ flex: 1.5, color: colors.text.tertiary, textAlign: 'right' }}>
                {test.reference}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.section, { marginTop: spacing.xl }]}>
        <AppText variant="label" style={{ color: '#F97316', marginBottom: spacing.sm, textTransform: 'uppercase', fontWeight: '700' }}>
          Doctor's Summary
        </AppText>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.md }]}>
          <AppText variant="body" style={{ color: colors.text.secondary, lineHeight: 22 }}>
            {record.description ?? 'Your blood counts are mostly within normal ranges. The WBC count is slightly elevated, which could indicate a mild infection or inflammation. Consider a follow-up if symptoms persist. Stay hydrated and maintain a balanced diet.'}
          </AppText>
        </View>
      </View>
    </>
  );
}

function PrescriptionContent({ record, colors, spacing }: { record: HealthRecord; colors: ReturnType<typeof useThemeColors>; spacing: ReturnType<typeof useThemeSpacing> }) {
  const medications = [
    { name: 'Ashwagandha Churna', dosage: '1 tsp twice daily with warm water', duration: '30 days', times: ['Morning', 'Evening'] },
    { name: 'Triphala Tablet', dosage: '1 tablet after dinner', duration: '15 days', times: ['Night'] },
    { name: 'Brahmi Syrup', dosage: '10ml twice daily', duration: '21 days', times: ['Morning', 'Evening'] },
  ];

  return (
    <>
      <View style={[styles.section, { marginTop: spacing.xl }]}>
        <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.md, textTransform: 'uppercase' }}>
          Medications
        </AppText>
        {medications.map((med, idx) => (
          <View
            key={med.name}
            style={[styles.medCard, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.md, marginBottom: spacing.sm, borderLeftWidth: 3, borderLeftColor: '#2D6A4F' }]}
          >
            <View style={styles.medHeader}>
              <AppText variant="body" style={{ color: '#2D6A4F', fontWeight: '700', flex: 1 }}>
                {med.name}
              </AppText>
              <AppText variant="caption" style={{ color: colors.text.secondary }}>
                {med.duration}
              </AppText>
            </View>
            <AppText variant="body" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
              {med.dosage}
            </AppText>
            <View style={[styles.timeChipRow, { marginTop: spacing.sm, flexDirection: 'row', gap: spacing.sm }]}>
              {med.times.map((time) => (
                <View
                  key={time}
                  style={[styles.timeChip, { backgroundColor: colors.action.primarySoft, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 999 }]}
                >
                  <AppText variant="caption" style={{ color: colors.action.primary, fontWeight: '500' }}>
                    {time === 'Morning' ? '🌅' : time === 'Evening' ? '🌆' : '🌙'} {time}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.section, { marginTop: spacing.lg }]}>
        <View style={[styles.instructionsCard, { backgroundColor: '#D1FAE5', borderRadius: spacing.md, padding: spacing.md }]}>
          <AppText variant="label" style={{ color: '#2D6A4F', marginBottom: spacing.xs, textTransform: 'uppercase', fontWeight: '700' }}>
            Special Instructions
          </AppText>
          <AppText variant="body" style={{ color: '#1B4332', lineHeight: 20 }}>
            Take medicines on an empty stomach for best absorption. Avoid cold and spicy foods during the course. Continue for the full prescribed duration even if symptoms improve.
          </AppText>
        </View>
      </View>

      <View style={[styles.section, { marginTop: spacing.lg }]}>
        <View style={[styles.followUpBanner, { backgroundColor: '#FEF3C7', borderRadius: spacing.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center' }]}>
          <AppText variant="h3" style={{ marginRight: spacing.sm }}>⏰</AppText>
          <View style={{ flex: 1 }}>
            <AppText variant="body" style={{ color: '#92400E', fontWeight: '600' }}>
              Follow-up in 14 days
            </AppText>
            <AppText variant="caption" style={{ color: '#A16207' }}>
              September 10, 2026
            </AppText>
          </View>
        </View>
      </View>
    </>
  );
}

function ConsultationContent({ record, colors, spacing }: { record: HealthRecord; colors: ReturnType<typeof useThemeColors>; spacing: ReturnType<typeof useThemeSpacing> }) {
  return (
    <>
      <View style={[styles.section, { marginTop: spacing.xl }]}>
        {[
          { label: 'Reason for Visit', content: 'Patient reports persistent fatigue, mild headaches, and difficulty sleeping for the past 3 weeks. Seeking holistic assessment and Ayurvedic treatment recommendations.' },
          { label: 'Clinical Notes', content: 'Pulse diagnosis (Nadi Pariksha) indicates Vata imbalance. Tongue coating suggests mild Ama (toxin accumulation). Patient has sedentary lifestyle and high screen time. Recommend Panchakarma consultation for deeper detox.' },
          { label: 'Recommendations', content: '1. Begin Ashwagandha and Brahmi supplementation\n2. Practice Pranayama for 15 minutes daily\n3. Follow Dinacharya (daily routine) protocol\n4. Reduce screen time after 8 PM\n5. Schedule Shirodhara session' },
        ].map((section) => (
          <View key={section.label} style={[styles.infoCard, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.md, marginBottom: spacing.md }]}>
            <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.sm, textTransform: 'uppercase' }}>
              {section.label}
            </AppText>
            <AppText variant="body" style={{ color: colors.text.primary, lineHeight: 22 }}>
              {section.content}
            </AppText>
          </View>
        ))}
      </View>

      <View style={[styles.section, { marginTop: spacing.lg }]}>
        <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.sm, textTransform: 'uppercase' }}>
          Prescribed Medicines
        </AppText>
        <View style={[styles.chipRow, { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }]}>
          {['Ashwagandha', 'Brahmi', 'Triphala', 'Brahmi Syrup'].map((med) => (
            <View
              key={med}
              style={[styles.medChip, { backgroundColor: '#D1FAE5', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 999 }]}
            >
              <AppText variant="body" style={{ color: '#2D6A4F', fontWeight: '500' }}>
                💊 {med}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.section, { marginTop: spacing.xl }]}>
        <Button title="Book Follow-up" variant="outline" size="medium" onPress={() => {}} style={{ width: '100%' }} />
      </View>
    </>
  );
}

function VaccinationContent({ record, colors, spacing }: { record: HealthRecord; colors: ReturnType<typeof useThemeColors>; spacing: ReturnType<typeof useThemeSpacing> }) {
  const administeredDate = new Date(record.occurredAt);
  const nextBooster = new Date(administeredDate);
  nextBooster.setFullYear(nextBooster.getFullYear() + 1);

  return (
    <>
      <View style={[styles.section, { marginTop: spacing.xl }]}>
        <View style={[styles.highlightCard, { backgroundColor: '#CFFAFE', borderRadius: spacing.md, padding: spacing.md, borderLeftWidth: 4, borderLeftColor: '#06B6D4' }]}>
          <AppText variant="label" style={{ color: '#0E7490', marginBottom: spacing.xs, textTransform: 'uppercase', fontWeight: '700' }}>
            Next Booster Due
          </AppText>
          <AppText variant="h3" style={{ color: '#155E75', marginBottom: spacing.xs }}>
            {nextBooster.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </AppText>
          <AppText variant="bodySmall" style={{ color: '#0E7490' }}>
            Schedule within 2 weeks before the due date
          </AppText>
        </View>
      </View>

      <View style={[styles.section, { marginTop: spacing.xl }]}>
        <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.md, textTransform: 'uppercase' }}>
          Details
        </AppText>
        {[
          { label: 'Provider', value: (record.metadata.provider as string) ?? 'Amrutam Wellness Center' },
          { label: 'Batch Number', value: (record.metadata.batchNumber as string) ?? 'VAC-2026-0847' },
          { label: 'Dose', value: (record.metadata.dose as string) ?? '1st Booster' },
          { label: 'Route', value: (record.metadata.route as string) ?? 'Intramuscular' },
        ].map((row) => (
          <View
            key={row.label}
            style={[styles.detailRow, { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border.light }]}
          >
            <AppText variant="body" style={{ color: colors.text.secondary }}>{row.label}</AppText>
            <AppText variant="body" style={{ color: colors.text.primary, fontWeight: '500' }}>{row.value}</AppText>
          </View>
        ))}
      </View>

      <View style={[styles.section, { marginTop: spacing.xl }]}>
        <Button title="📅 Set Calendar Reminder" variant="primary" size="large" onPress={() => {}} style={{ width: '100%' }} />
      </View>
    </>
  );
}

function AllergyContent({ record, colors, spacing }: { record: HealthRecord; colors: ReturnType<typeof useThemeColors>; spacing: ReturnType<typeof useThemeSpacing> }) {
  const severity = (record.metadata.severity as string) ?? 'moderate';

  return (
    <>
      <View style={[styles.section, { marginTop: spacing.xl }]}>
        <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.sm, textTransform: 'uppercase' }}>
          Reaction
        </AppText>
        <View style={[styles.infoCard, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.md }]}>
          <AppText variant="body" style={{ color: colors.text.primary, lineHeight: 22 }}>
            {record.description ?? 'Patient experiences skin rash, mild swelling, and nasal congestion upon exposure. Symptoms typically appear within 30 minutes of contact and subside within 2-3 hours with antihistamine medication.'}
          </AppText>
        </View>
      </View>

      <View style={[styles.section, { marginTop: spacing.xl }]}>
        <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.md, textTransform: 'uppercase' }}>
          Severity Level
        </AppText>
        <View style={[styles.severityRow, { flexDirection: 'row', gap: spacing.sm }]}>
          {(['mild', 'moderate', 'severe'] as const).map((level) => {
            const isSelected = severity === level;
            const bgColor = isSelected
              ? level === 'mild' ? '#F97316' : level === 'moderate' ? '#DC2626' : '#7F1D1D'
              : 'transparent';
            const borderColor = isSelected
              ? level === 'mild' ? '#F97316' : level === 'moderate' ? '#DC2626' : '#7F1D1D'
              : colors.border.default;
            return (
              <TouchableOpacity
                key={level}
                activeOpacity={0.7}
                style={[styles.severityButton, { flex: 1, backgroundColor: bgColor, borderColor, borderWidth: 1.5, borderRadius: spacing.sm, paddingVertical: spacing.md, alignItems: 'center' }]}
              >
                <AppText
                  variant="body"
                  style={{ color: isSelected ? '#FFFFFF' : colors.text.primary, fontWeight: isSelected ? '700' : '500', textTransform: 'capitalize' }}
                >
                  {level === 'mild' ? '😊' : level === 'moderate' ? '😐' : '😟'} {level}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={[styles.section, { marginTop: spacing.xl }]}>
        <View style={[styles.clinicalCard, { backgroundColor: '#FFEDD5', borderRadius: spacing.md, padding: spacing.md }]}>
          <AppText variant="label" style={{ color: '#C2410C', marginBottom: spacing.sm, textTransform: 'uppercase', fontWeight: '700' }}>
            Clinical Notes
          </AppText>
          <AppText variant="body" style={{ color: '#9A3412', lineHeight: 22 }}>
            {record.description ?? 'Patient has a documented history of this allergy. Prescribed antihistamines for acute episodes. Epinephrine auto-injector recommended for severe reactions. Allergy immunotherapy may be considered after further assessment.'}
          </AppText>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topBarRight: { flexDirection: 'row', gap: 4 },
  scrollContent: {},
  typeBadge: {},
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 },
  section: {},
  tableCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tableHeader: {},
  tableRow: {},
  summaryCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  medHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeChipRow: {},
  timeChip: {},
  instructionsCard: {},
  followUpBanner: {},
  infoCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  chipRow: {},
  medChip: {},
  highlightCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  detailRow: {},
  severityRow: {},
  severityButton: {},
  clinicalCard: {},
  attachmentCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  attachmentIcon: {},
});
