import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Edit,
  BooleanInput,
  DateInput,
  SaveButton,
  EditButton,
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
  useEditContext,
  Title,
  useRefresh,
  required,
  minLength,
  maxLength,
  minValue,
  maxValue,
  number,
} from 'react-admin';
//import { useFormState } from 'react-hook-form';
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
  const redirect = useRedirect();
  const {
    invalid: isInvalid,
    pristine,
    handleSubmit,
    handleSubmitWithRedirect,
  } = props;
  console.log(
    handleSubmit,
    handleSubmitWithRedirect,
    props,
    'submit functions'
  );
  const { record, saving, setOnSuccess } = useEditContext();

  const handleSuccess = () => {
    //const { saving: statusSave } = useEditContext();
    console.info(`Данные задачи ${record.id} сохранены успешно`);
    // if (saving)
    //   if (localStorage.getItem('redirectTo')) {
    //     const redirectTo = localStorage.getItem('redirectTo');
    //     console.log(redirectTo);
    //     localStorage.removeItem('redirectTo');
    //     redirect('/comments/create');
    //   } else redirect(`/tasks/${record.id}/show`);
  };

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
        label="Сохранить"
        key={1}
        onClick={() => {
          handleSubmit();
          //setOnSuccess(handleSuccess);
        }}
        redirect={'show'}
        disabled={isInvalid || pristine}
      />
      <FormDataConsumer>
        {({ formData, ...rest }) => (
          <SaveButton
            label="Перейти к комментарию"
            icon={<AddCommentIcon />}
            onClick={() => {
              //localStorage.setItem('redirectTo', 'comments');
              console.log(record, 'record context');
              localStorage.setItem('currentTaskId', record.id);
              handleSubmit();
              //setOnSuccess(handleSuccess);
            }}
            redirect={'/comments/create'}
            handleSubmitWithRedirect={handleSubmitWithRedirect}
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
  //const rec= useRecordContext();
  const { user: authUser } = useSelector(getAuthData());

  const transform = (data) => {
    console.log(data, 'transform data from edit');
    return {
      ...data,
      userId: authUser.uid,
      finishedAt: data.status ? dateFormatter(Date.now()) : '',
    };
  };

  const handleError = ({ error }) => {
    notify(`Возникла ошибка: ${error?.message}`, { type: 'error' }); // default message is 'ra.notification.created'
    refresh();
  };

  const handleFailure = ({ error }) => {
    notify(`Возникла ошибка: ${error.message}`, { type: 'error' }); // default message is 'ra.notification.created'
    refresh();
  };

  return (
    <>
      {authUser && (
        <Edit
          {...props}
          //mutationMode="undoable"
          //warnWhenUnsavedChanges
          transform={transform}
          // queryOptions={{
          //   refetchOnReconnect: true,
          //   retry: 3,
          //   onSuccess: (data) => {
          //     console.log(data, 'new data refetch on edit component');
          //   },
          // }}
          //redirect={false}
          //onSuccess={handleSuccess}
          onFailure={handleFailure}
        >
          <SimpleForm
            mode="onBlur"
            warnWhenUnsavedChanges
            toolbar={<CustomToolbar />}
          >
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
