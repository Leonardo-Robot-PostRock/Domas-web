import type { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib';
import { setCloustersGroup, setFavouriteClousters } from '@/lib/store/cluster/clusterSlice';
import Select from 'react-select';
import { Controller } from 'react-hook-form';

import { FormValidations } from '@/utils/TeamsFormUtils';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';

import type { ClusterOption, SelectCluster } from '@/types/store/cluster';
import type { Props } from '@/types/Form/FormFieldProps';

export const SelectFieldCluster = ({ control, errors }: Props): ReactNode => {
  const dispatch = useAppDispatch();
  const { cluster, clustersGroup, favouriteCluster } = useAppSelector((state) => state.cluster);

  const handleClusters = (option: readonly ClusterOption[]): void => {
    console.log('from handle Clusters', option);

    dispatch(setCloustersGroup(option));
    const clusters: SelectCluster[] = [...favouriteCluster];

    option.forEach((item) => {
      if (!clusters.some((clusterItem) => clusterItem.cluster_id === item.value)) {
        clusters.push({ cluster_id: item.value, isChecked: false });
      }
    });

    dispatch(setFavouriteClousters(clusters));
  };

  return (
    <>
      <Controller
        control={control}
        name="cluster"
        rules={{ required: !(clustersGroup.length > 0) }}
        render={({ field }) => (
          <Select
            {...field}
            closeMenuOnSelect={false}
            defaultValue={clustersGroup}
            isMulti
            isSearchable={true}
            onChange={(option: unknown) => {
              handleClusters(option as ClusterOption[]);
            }}
            options={cluster}
            placeholder={'Seleccionar...'}
            isClearable
          />
        )}
      />
      <ErrorDisplay errors={errors?.cluster} message={FormValidations.REQUIRED} />
    </>
  );
};
