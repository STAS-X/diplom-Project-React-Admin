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
  useNotify,
  useRedirect,
  useGetOne,
  FunctionField,
  ReferenceArrayInput,
  FormDataConsumer,
  Toolbar,
  useGetList,
  useRefresh,
  required,
  minLength,
  minValue,
  maxValue,
  number,
} from 'react-admin';
import { Stack, Box, Typography, Avatar, Chip } from '@mui/material';
import {AddCommentRounded as AddCommentIcon, Add} from '@material-ui/icons';
import TaskProgressBar from '../../common/progressbar/task.progress';
import TagsField from '../../common/fields/task.tags';
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
        return 0;
      }
    } else {
      return 0;
    }
  }
};

const ExecutorChipSelector = ({ id, name, data }) => {
  const result = getTaskResult(data);

  return (
    <Chip
      label={name ? name : '-XXX-'}
      avatar={
        <Avatar
          alt="Пользователь"
          src={data.url?data.url:`https://i.pravatar.cc/300?u=${id}`}
          sx={{ width: 24, height: 24 }}
        />
      }
      sx={{
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

const CustomToolbar = ({ authId, ...props }) => {
  //const notify = useNotify();
  //const redirect = useRedirect();
  //const refresh = useRefresh();
  const redirect = useRedirect();
  const {
    invalid: isInvalid,
    pristine,
    record,
    handleSubmit,
    handleSubmitWithRedirect,
  } = props;

  const { data: comments, loaded, total } = useGetList(
    'comments',
    { page: 1, perPage: 1 },
    { field: 'id', order: 'ASC' },
    { userId: authId, taskId: record.id }
  );

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
        label={'Сохранить'}
        icon={<Add />}
        onSucces={() => {
          handleSubmit();
          //setOnSuccess(handleSuccess);
        }}
        redirect={`/tasks/${record.id}/show`}
        disabled={isInvalid || pristine}
      />
      <FormDataConsumer>
        {({ formData, ...rest }) => (
          <SaveButton
            label="Перейти к комментарию"
            icon={<AddCommentIcon />}
            onClick={() => {
              localStorage.setItem('currentTaskId', record.id);
              handleSubmit();
              //setOnSuccess(handleSuccess);
            }}
            redirect={
              loaded && total === 1
                ? `/comments/${comments[Object.keys(comments)[0]].id}`
                : '/comments/create'
            }
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
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  const {
    data: { userId: editUserId },
    loaded: isLoaded,
  } = useGetOne('tasks', props.id);

  const { user: authUser } = useSelector(getAuthData());

  const transform = (data) => {
    return {
      ...data,
      userId: authUser.uid,
      finishedAt: data.status ? dateFormatter(Date.now()) : '',
    };
  };

  const handleFailure = ({ error }) => {
    notify(`Возникла ошибка: ${error}`, { type: 'warning' }); // default message is 'ra.notification.created'
    refresh();
  };

  React.useEffect(() => {
    if (isLoaded && authUser.uid !== editUserId)
      setTimeout(() => redirect('show', '/tasks', props.id), 0);
    return () => {};
  }, [isLoaded]);

  return (
    <>
      {authUser && (
        <Edit
          {...props}
          mutationMode="undoable"
          transform={transform}
          onFailure={handleFailure}
          hasShow={false}
          redirect={false}
        >
          <SimpleForm
            mode="onBlur"
            warnWhenUnsavedChanges
            toolbar={<CustomToolbar authId={authUser.uid} />}
          >
            <FunctionField
              addLabel={false}
              render={(record) => (
                <h3 className="titleDialog">
                  Редактирование задачи #{record.id}{' '}
                </h3>
              )}
            />

            <TextInput disabled label="Идентификатор" source="id" />

            <TextInput
              label="Наименование"
              source="title"
              validate={validateTitle}
              defaultValue={'Заголовок'}
            ></TextInput>

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
                        style={{ display: 'block-flex' }}
                        optionText={(choise) => (
                          <ExecutorChipSelector
                            {...choise}
                            data={{ ...formData }}
                          />
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
        </Edit>
      )}
    </>
  );
};
