import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Create,
  BooleanInput,
  DateInput,
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
  useCreate,
  useCreateContext,
  CreateButton,
  Toolbar,
  useNotify,
  useRedirect,
  useRefresh,
  useInput,
  Title,
  ReferenceArrayInput,
  FormDataConsumer,
  required,
  minLength,
  maxLength,
  minValue,
  maxValue,
  number,
} from 'react-admin';
import { useFormState, useFormContext, useController, useWatch } from 'react-hook-form';
import { Box, Typography, Button } from '@mui/material';
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
  const notify = useNotify();
  const redirect = useRedirect();
  //const refresh = useRefresh();
  console.log(props, 'пропсы');
  const { invalid: isInvalid, handleSubmit, handleSubmitWithRedirect } = props;

  return (
    <Toolbar
      {...props}
      style={{ display: 'inline-flex', justifyContent: 'space-between', minWidth: 500 }}
    >
      <CreateButton
        label="Создать"
        onClick={() => {
          handleSubmit();
        }}
        disabled={isInvalid}
      />
      <FormDataConsumer>
        {({ formData, ...rest }) => (
          <CreateButton
            icon={<AddCommentIcon />}
            label={'Создать и комментировать'}
            onClick={() => {
              handleSubmitWithRedirect('/comments/create');
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

export const TaskCreate = (props) => {
  //const notify = useNotify();
  //const refresh = useRefresh();

  const { user: authUser } = useSelector(getAuthData());

  const transform = (data) => {

    return {
      ...data,
      userId: authUser.uid,
      createdAt: dateFormatter(Date.now()),
      finishedAt: data.status ? dateFormatter(Date.now()) : '',
    };
  };


  const handleError = ({ error }) => {
    notify(`Возникла ошибка: ${error.message}`, { type: 'error' }); // default message is 'ra.notification.created'
    refresh();
  };

  return (
    <>
      {authUser && (
        <Create
          {...props}
          title="Создание новой задачи"
          onError={handleError}
          transform={transform}
          redirect={false}
        >
          <SimpleForm
            mode="onBlur"
            warnWhenUnsavedChanges
            toolbar={<CustomToolbar />}
          >
            <Title>Тестовый титл формы</Title>
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
            <FormDataConsumer>
              {({ formData, ...rest }) => {
                console.log(formData, 'data of formconsumer');
                return (
                  <SelectInput
                    resettable={true}
                    label="Прогресс бар"
                    source="progressType"
                    validate={required('Необходимо выбрать прогрессбар')}
                    //validate={required('Необходимо выбрать прогрессбар')}
                    optionText={(choise) =>
                      ProgressBarField(
                        choise.id,
                        formData.progress
                          ? formData.progress
                          : getRandomInt(30, 80)
                      )
                    }
                    choices={[
                      { id: 1, name: 'Круговой' },
                      { id: 2, name: 'Линейчатый' },
                      { id: 3, name: 'Анимированный' },
                    ]}
                  />
                );
              }}
            </FormDataConsumer>
            <ReferenceArrayInput
              label="Исполнители"
              allowEmpty={false}
              source="executors"
              reference="users"
              validate={required('Необходимо выбрать исполнителей')}
              helperText="Выберите тип графика"
              filter={{ id_neq: authUser.uid }}
              sort={{ field: 'name', order: 'ASC' }}
            >
              <SelectArrayInput
                optionText="name"
                helperText="Выберите исполнтелей"
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
        </Create>
      )}
    </>
  );
};
