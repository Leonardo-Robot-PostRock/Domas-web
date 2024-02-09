import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

export const TeamsForm = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  return <div>TeamsForm</div>;
};
