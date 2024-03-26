/* eslint-disable @typescript-eslint/naming-convention */
import type { ChangeEvent, ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { Checkbox, Flex, Text } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '@/lib';

import { setFavouriteClousters } from '@/lib/store/cluster/clusterSlice';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { FormValidations } from '@/utils/formTeams/TeamsFormUtils';

import type { Props } from '@/types/Form/FormFieldProps';

export const CheckboxMainCluster = ({ control, errors }: Props): ReactNode => {
  const dispatch = useAppDispatch();
  const { clustersGroup, favouriteCluster } = useAppSelector((state) => state.cluster);

  const handleCheckbox = (event: ChangeEvent<HTMLInputElement>, cluster_id: number | null): void => {
    let clusters = [...favouriteCluster];

    clusters = clusters.map((item) =>
      item.cluster_id === cluster_id ? { cluster_id, isChecked: event.target.checked } : item
    );
    dispatch(setFavouriteClousters(clusters));
  };

  return (
    <>
      <Controller
        control={control}
        name="cluster_favourite"
        rules={{ required: false }}
        render={({ field }) => (
          <Flex direction="column" wrap="wrap">
            {clustersGroup.length > 0 &&
              clustersGroup.map((cluster, index) => {
                return (
                  <Checkbox
                    w="max-content"
                    id={`field-${cluster.value}`}
                    key={index}
                    {...field}
                    value={cluster.value as unknown as number}
                    isChecked={favouriteCluster.find((item) => item.cluster_id === cluster.value)?.isChecked ?? false}
                    onChange={(event) => {
                      handleCheckbox(event, cluster.value as number | null);
                    }}
                  >
                    <Text>{cluster.label}</Text>
                  </Checkbox>
                );
              })}
          </Flex>
        )}
      />

      <ErrorDisplay errors={errors?.favouriteCluster} message={FormValidations.CLUSTER_CONF_REQUIRED} />
    </>
  );
};
