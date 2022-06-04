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
  FunctionField,
  ReferenceInput,
  FileInput,
  FileField,
  ArrayInput,
  SimpleFormIterator,
  useCreate,
  useCreateContext,
  CreateButton,
  SaveButton,
  Toolbar,
  useNotify,
  useRedirect,
  useRefresh,
  useInput,
  Title,
  ReferenceArrayInput,
  FormDataConsumer,
  useGetList,
  required,
  minLength,
  maxLength,
  minValue,
  maxValue,
  number,
} from 'react-admin';
import { Box, Typography, Chip, Stack, Avatar, Button } from '@mui/material';
import AddCommentIcon from '@material-ui/icons/AddCommentRounded';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import TaskProgressBar from '../../common/progressbar/task.progress';
import TagsField from '../../common/fields/task.tags';
import { green, blue, red } from '@mui/material/colors';
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

const getTaskResult = (data) => {
  if (data.status) {
    if (new Date(data.finishedAt) <= new Date(data.executeAt)) {
      return 1;
    } else {
      return 0;
    }
  } else {
    if (new Date(data.executeAt) < new Date()) {
      if (data.progress < 100) {
        return -1;
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  }
};

const ExecutorChipSelector = ({ id, name, data }) => {
  //const record = useRecordContext();
  const result = getTaskResult(data);

  return (
    <Chip
      label={name ? name : '-XXX-'}
      avatar={
        <Avatar
          alt="Пользователь"
          src={data.url ? data.url : `https://i.pravatar.cc/300?u=${id}`}
          sx={{ width: 24, height: 24 }}
        />
      }
      sx={{
        id: { id },
        fontWeight: 'bold',
        fontSize: 14,
        'span:after': {
          content: result === 1 ? '" ✔️"' : '" 😐"',
          color: result >= 0 ? 'green' : 'inherit',
        },
      }}
    />
  );
};

const CustomToolbar = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();
  //const refresh = useRefresh();
  const {
    invalid: isInvalid,
    record,
    handleSubmit,
    handleSubmitWithRedirect,
  } = props;

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
        label="Создать"
        onClick={() => {
          handleSubmit();
        }}
        disabled={isInvalid}
      />
      <FormDataConsumer>
        {({ formData, ...rest }) => (
          <SaveButton
            icon={<AddCommentIcon />}
            label={'Создать и комментировать'}
            onClick={() => {
              localStorage.setItem('currentTaskId', record.id);
              handleSubmit('/comments/create');
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

export const TaskCreate = (props) => {
  //const notify = useNotify();
  //const refresh = useRefresh();
  const { id: taskId } = props;

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
    notify(`Возникла ошибка: ${error}`, { type: 'warning' }); // default message is 'ra.notification.created'
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
          hasShow={false}
          redirect={false}
        >
          <SimpleForm
            mode="onBlur"
            warnWhenUnsavedChanges
            toolbar={<CustomToolbar />}
          >
            <FunctionField
              addLabel={false}
              render={(record) => (
                <h3 className="titleDialog">Создание задачи </h3>
              )}
            />
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
                return (
                  <Stack direction="row" display="inline-grid">
                    <SelectInput
                      resettable={true}
                      label="Прогресс бар"
                      source="progressType"
                      validate={required('Необходимо выбрать прогрессбар')}
                      //validate={required('Необходимо выбрать прогрессбар')}
                      optionText={(choise) =>
                        ProgressBarField(
                          choise.id,
                          !isNaN(formData.progress)
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
                        name="executors"
                        optionText={(choise) => (
                          <ExecutorChipSelector {...choise} data={formData} />
                        )}
                        helperText="Выберите исполнителей"
                      />
                    </ReferenceArrayInput>

                    <TagsField {...props.record} />
                  </Stack>
                );
              }}
            </FormDataConsumer>

            <NumberInput
              label="Готовность (%)"
              source="progress"
              step={10}
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
