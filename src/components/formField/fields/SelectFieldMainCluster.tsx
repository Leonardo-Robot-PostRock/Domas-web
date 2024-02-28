/* eslint-disable @typescript-eslint/naming-convention */
import type { ChangeEvent, ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { Checkbox, Flex, Text } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '@/lib';

import { setFavouriteClousters } from '@/lib/store/cluster/clusterSlice';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { FormValidations } from '@/utils/TeamsFormUtils';

import type { Props } from '@/types/Form/FormFieldProps';

export const SelectFieldMainCluster = ({ control, errors }: Props): ReactNode => {
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
        name="clusterConfig"
        rules={{ required: false }}
        render={({ field }) => (
          <Flex direction="column" wrap="wrap">
            {clustersGroup.length > 0 &&
              clustersGroup.map((cluster, index) => {
                return (
                  <Checkbox
                    key={index}
                    {...field}
                    value={cluster.value?.toString()}
                    isChecked={favouriteCluster.find((item) => item.cluster_id === cluster.value)?.isChecked ?? false}
                    onChange={(event) => {
                      handleCheckbox(event, cluster.value);
                    }}
                  >
                    <Text>{cluster.label}</Text>
                  </Checkbox>
                );
              })}
          </Flex>
        )}
      />

      <ErrorDisplay errors={errors?.clusterConfig} message={FormValidations.REQUIRED} />
    </>
  );
};
