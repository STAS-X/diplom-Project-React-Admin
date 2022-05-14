import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Edit,
  BooleanInput,
  DateInput,
  SaveButton,
  SimpleForm,
  TextInput,
  SelectInput,
  SelectArrayInput,
  NumberInput,
  ReferenceInput,
  FileInput,
  FileField,
  ArrayInput,
  SimpleFormIterator,
  useNotify,
  useRedirect,
  useRecordContext,
  ReferenceArrayInput,
  FormDataConsumer,
  Toolbar,
  Title,
  useRefresh,
  required,
  minLength,
  maxLength,
  minValue,
  maxValue,
  number,
} from 'react-admin';
import { useFormState } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import AddCommentIcon from '@material-ui/icons/AddCommentRounded';
import TaskProgressBar from '../../common/progressbar/task.progress';
import { getAuthData } from '../../../store/authcontext';
import {
  getRandomInt,
  dateWithDays,
  normalise,
} from '../../../utils/getRandomInt';
import { dateFormatter } from '../../../utils/displayDate';

const ProgressBarField = (id, progress) => (
  <Box sx={{ position: 'relative', display: 'inline-flex', minWidth: 240 }}>
    <TaskProgressBar id={id} value={progress} />
    <Typography
      variant="caption"
      component="div"
      color="text.secondary"
      sx={{ ml: 3, mt: 0.5 }}
    >
      {id === 1
        ? 'Круговая диаграмма'
        : id === 2
        ? 'Линейчатая диаграмма'
        : 'Анимированная диаграмма'}
    </Typography>
  </Box>
);

const CustomToolbar = (props) => {
  //const notify = useNotify();
  //const redirect = useRedirect();
  //const refresh = useRefresh();
  //const { invalid: isInvalid , handleSubmit, handleSubmitWithRedirect } = props;
  console.log(props, 'props edit');
  const { invalid: isInvalid, handleSubmit, handleSubmitWithRedirect } = props;

  return (
    <Toolbar
      {...props}
      style={{
        display: 'inline-flex',
        justifyContent: 'space-between',
        minWidth: 500,
      }}
    >
      <SaveButton
        label="Редактировать"
        onClick={() => {
          handleSubmit();
        }}
        disabled={isInvalid}
      />
      <FormDataConsumer>
        {({ formData, ...rest }) => (
          <SaveButton
            label="Перейти к комментарию"
            icon={<AddCommentIcon />}
            onClick={() => {
              localStorage.setItem('redirectTo', '/comments/create');
              handleSubmit();
            }}
            disabled={!formData.commentable || isInvalid}
          />
        )}
      </FormDataConsumer>
    </Toolbar>
  );
};

const validateTitle = [
  required('Необходимо ввести название'),
  minLength(3, 'Название должно быть более 3-х символов'),
];
const validateDescription = [
  required('Необходимо описание'),
  minLength(3, 'Описание должно быть более 3-х символов'),
];
const validateProgress = [
  required('Необходимо ввести прогресс задачи'),
  number('Должно быть числом'),
  minValue(0, 'Не может быть отрицательным числом'),
  maxValue(100, 'Не может превышать 100%'),
];

const validateExecDate = (value, allValues) => {
  if (!value) {
    return 'Необходимо выбрать дату исполнения';
  }
  if (new Date(value) < Date.now()) {
    return 'Дата исполнения должна быть больше текущей';
  }
  return undefined;
};

export const TaskEdit = (props) => {
  //const notify = useNotify();
  const redirect = useRedirect();
  //const rec= useRecordContext();
  //console.log(rec)

  const { user: authUser } = useSelector(getAuthData());

  const transform = (data) => {
    return {
      ...data,
      userId: authUser.uid,
      finishedAt: data.status ? dateFormatter(Date.now()) : '',
    };
  };

  const handleSuccess = () => {
    if (localStorage.getItem('redirectTo')) {
      const redirectTo = localStorage.getItem('redirectTo');
      localStorage.removeItem('redirectTo');
      if (redirectTo) redirect(redirectTo);
    }
  };

  const handleError = ({ error }) => {
    notify(`Возникла ошибка: ${error.message}`, { type: 'error' }); // default message is 'ra.notification.created'
    refresh();
  };

  return (
    <>
      {authUser && (
        <Edit
          {...props}
          mutationMode="undoable"
          //warnWhenUnsavedChanges
          transform={transform}
          // queryOptions={{
          //   refetchOnReconnect: true,
          //   retry: 3,
          //   onSuccess: (data) => {
          //     console.log(data, 'new data refetch on edit component');
          //   },
          // }}
          onSuccess={handleSuccess}
          onError={handleError}
        >
          <SimpleForm
            mode="onBlur"
            warnWhenUnsavedChanges
            toolbar={<CustomToolbar />}
          >
            <Title>Тестовый титл формы</Title>
            <TextInput disabled label="Идентификатор" source="id" />

            <TextInput
              label="Наименование"
              source="title"
              validate={validateTitle}
              defaultValue={'Заголовок'}
            />
            <TextInput
              label="Описание"
              source="description"
              validate={validateDescription}
              defaultValue={'Текст описания к задаче'}
            />
            <DateInput
              disabled
              label="Создано"
              source="createdAt"
              parse={dateFormatter}
              //defaultValue={dateFormatter(new Date())}
            />
            <FormDataConsumer>
              {({ formData, ...rest }) => (
                <SelectInput
                  resettable
                  label="Прогресс бар"
                  source="progressType"
                  optionText={(choise) =>
                    ProgressBarField(
                      choise.id,
                      formData.progress
                        ? formData.progress
                        : getRandomInt(30, 80)
                    )
                  }
                  validate={required('Необходимо выбрать прогрессбар')}
                  helperText="Выберите тип графика"
                  choices={[
                    { id: 1, name: 'Круговой' },
                    { id: 2, name: 'Линейчатый' },
                    { id: 3, name: 'Анимированный' },
                  ]}
                />
              )}
            </FormDataConsumer>
            <ReferenceArrayInput
              label="Исполнители"
              allowEmpty={false}
              source="executors"
              reference="users"
              filter={{ id_neq: authUser.uid }}
              validate={required('Необходимо выбрать исполнителей')}
              sort={{ field: 'name', order: 'ASC' }}
            >
              <SelectArrayInput
                optionText="name"
                helperText="Выберите исполнителей"
              />
            </ReferenceArrayInput>

            <NumberInput
              label="Готовность (%)"
              source="progress"
              parse={(value) => normalise(value, 0, 100)}
              validate={validateProgress}
              defaultValue={0}
            />

            <DateInput
              label="Дата исполнения"
              source="executeAt"
              parse={dateFormatter}
              validate={validateExecDate}
              defaultValue={dateWithDays(7)}
            />
            <BooleanInput
              label="Завершить"
              source="status"
              defaultValue={false}
            />
            <BooleanInput
              label="Комментарии"
              source="commentable"
              defaultValue={true}
            />
          </SimpleForm>
        </Edit>
      )}
    </>
  );
};
