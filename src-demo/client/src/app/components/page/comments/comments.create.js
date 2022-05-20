import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Create,
  DateInput,
  SaveButton,
  EditButton,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  ReferenceInput,
  FileInput,
  FileField,
  ArrayInput,
  SimpleFormIterator,
  useNotify,
  useRedirect,
  useRecordContext,
  FormDataConsumer,
  Toolbar,
  useEditContext,
  useEditController,
  Title,
  useRefresh,
  required,
  minLength,
  maxLength,
  minValue,
  maxValue,
  number,
  useGetList
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import { makeStyles } from '@material-ui/core/styles';
//import { useFormState } from 'react-hook-form';
import { green, blue, red } from '@mui/material/colors';
import {
  Stack,
  Box,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import TaskEditIcon from '@material-ui/icons/EditRounded';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import TaskProgressBar from '../../common/progressbar/task.progress';
import TagsField from '../../common/fields/task.tags';
import { getAuthData } from '../../../store/authcontext';
import {
  getRandomInt,
  dateWithDays,
  normalise,
} from '../../../utils/getRandomInt';
import { dateFormatter } from '../../../utils/displayDate';

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

const TaskForCommentSelector = ({ id, title, ...data }) => {
  const result = getTaskResult(data);
  return (
    <Chip
      label={`${title} - id#${id}`}
      sx={{
        '&': {
          minWidth: 150,
          backgroundColor: result === 1 ? blue[200] : green[200],
          color:
            result === 1 ? green[600] : result === 0 ? blue[600] : red[600],
          fontWeight: 'bold',
          fontSize: 14,
          'span:after': {
            content: result === 1 ? '" ✔️"' : '" 😐"',
            color: result >= 0 ? 'green' : 'inherit',
          },
        },
      }}
    />
  );
};

const CustomToolbar = ({ authId, ...props }) => {
  console.log(props, 'Комментарий через контекст диалога');

  const redirect = useRedirect();

  const {
    invalid: isInvalid,
    record,
    pristine,
    handleSubmit,
    handleSubmitWithRedirect,
  } = props;

  console.log(authId, record.userId, record.taskId, 'сравнение Id');

  const handleSuccess = () => {
    console.info(`Данные задачи ${record.id} сохранены успешно`);
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
        }}
        redirect={'show'}
        disabled={isInvalid || pristine}
      />
      <FormDataConsumer>
        {({ formData, ...rest }) => (
          <SaveButton
            label="Перейти к задаче"
            icon={<TaskEditIcon />}
            onClick={() => {
              handleSubmit();
            }}
            redirect={`/tasks/${record.taskId}`}
            handleSubmitWithRedirect={handleSubmitWithRedirect}
            disabled={authId !== record.userId || isInvalid}
          />
        )}
      </FormDataConsumer>
    </Toolbar>
  );
};

const validateBody = [
  required('Необходимо ввести тело комментария'),
  minLength(3, 'Комментарий должен быть более 3-х символов'),
];
const validateDescription = [
  required('Необходимо описание'),
  minLength(3, 'Описание должно быть более 3-х символов'),
];

export const CommentCreate = (props) => {
  const { user: authUser } = useSelector(getAuthData());

  const { data: comments, total, loaded } = useGetList(
    'comments',
    { page: 1, perPage: -1 },
    { field: 'id', order: 'ASC' },
    { userId: authUser.uid }
  );

  const transform = (data) => {
    console.log(data, 'transform data from edit');
    return {
      ...data,
      createdAt: dateFormatter(Date.now()),
      userId: authUser.uid,
    };
  };

  const handleFailure = ({ error }) => {
    notify(`Возникла ошибка: ${error.message}`, { type: 'error' }); // default message is 'ra.notification.created'
    refresh();
  };

  return (
    <>
      {authUser && (
      <Create
        {...props}
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
          <h2 className="titleDialog">
            Создание комментария 
          </h2>

           <TextInput
            label="Описание"
            source="description"
            validate={validateDescription}
            defaultValue={'Текст описания к задаче'}
          />

          <FormDataConsumer>
            {({ formData, ...rest }) => {
              console.log(formData, 'data form edit');
              return (
                <>
                {loaded && (<ReferenceInput
                  label="Комментируемая задача"
                  allowEmpty={false}
                  source="taskId"
                  reference="tasks"
                  filter={total>0?{id_nar: Object.keys(comments)}:{}}
                  validate={required('Необходимо выбрать задачу  для комментария')}
                  sort={{ field: 'title', order: 'ASC' }}
                >
                  <SelectInput
                    name="tasks"
                    optionText={(choise) => (
                      <TaskForCommentSelector {...choise} />
                    )}
                    helperText="Выберите задачу для комментирования"
                  />
                </ReferenceInput>)}
                {!loaded && (<CircularProgress color="inherit"/>)}
                </>
              );
            }}
          </FormDataConsumer>

          <RichTextInput
            label="Комментарий"
            source="body"
            validate={validateBody}
            defaultValue={'Комментарий к задаче'}
            helperText="Введите текст комментария"
          />
        </SimpleForm>
      </Create>)}
    </>
  );
};
