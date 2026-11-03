'use client';

import { Alert, Group, Loader, Paper, Stack, Switch, Text } from '@mantine/core';
import { IconAlertCircle, IconPuzzle } from '@tabler/icons-react';
import { FeatureKey } from '@/src/core/api';
import { useInstitutesMirror } from '../store/useInstitutesMirror';
import { FEATURE_LABELS, institutesLabels } from '../static-data/institutes.data';

export interface InstituteFeaturesSectionProps {
  onToggle: (key: FeatureKey, enabled: boolean) => Promise<void>;
}

/**
 * InstituteFeaturesSection
 *
 * Feature flags of the institute open in the details drawer, with on/off switches.
 * ZERO useState — reads features and saving state from useInstitutesMirror.
 */
export function InstituteFeaturesSection({ onToggle }: InstituteFeaturesSectionProps) {
  const features = useInstitutesMirror('features');
  const isLoading = useInstitutesMirror('isLoadingFeatures');
  const savingKey = useInstitutesMirror('featureSavingKey');
  const error = useInstitutesMirror('featuresError');
  const setFeaturesError = useInstitutesMirror('setFeaturesError');

  return (
    <Stack gap="sm">
      <Group gap="xs">
        <IconPuzzle size={18} color="var(--mantine-color-primary-6)" />
        <Text fw={500} size="sm" c="dimmed">
          {institutesLabels.featuresSectionTitle}
        </Text>
      </Group>

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          variant="light"
          radius="md"
          withCloseButton
          onClose={() => setFeaturesError(null)}
        >
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Group gap="xs">
          <Loader size="xs" />
          <Text size="xs" c="dimmed">
            {institutesLabels.featuresLoading}
          </Text>
        </Group>
      ) : (
        <Stack gap="xs">
          {features.map((feature) => (
            <Paper key={feature.key} p="sm" radius="lg" withBorder>
              <Group justify="space-between" wrap="nowrap">
                <Stack gap={0}>
                  <Text size="sm" fw={500}>
                    {FEATURE_LABELS[feature.key].title}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {FEATURE_LABELS[feature.key].description}
                  </Text>
                </Stack>
                {savingKey === feature.key ? (
                  <Loader size="xs" />
                ) : (
                  <Switch
                    checked={feature.enabled}
                    disabled={savingKey !== null}
                    onChange={(e) => onToggle(feature.key, e.currentTarget.checked)}
                    aria-label={FEATURE_LABELS[feature.key].title}
                  />
                )}
              </Group>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
