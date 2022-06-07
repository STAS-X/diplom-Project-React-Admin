import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Create,
  SaveButton,
  SimpleForm,
  TextInput,
  SelectInput,
   ReferenceInput,
  FunctionField,
  useRedirect,
  FormDataConsumer,
  Toolbar,
  required,
  minLength,
  useGetList,
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import { makeStyles } from '@material-ui/core/styles';
//import { useFormState } from 'react-hook-form';
import { green, blue, red } from '@mui/material/colors';
import {
  Chip,
  CircularProgress,
} from '@mui/material';
import TaskEditIcon from '@material-ui/icons/EditRounded';
import { getAuthData } from '../../../store/authcontext';
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

const TaskForCommentSelector = (data) => {
  const { id, title } = data;
  const result = getTaskResult(data);
  if (title === undefined) return '';

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
  const redirect = useRedirect();

  const {
    invalid: isInvalid,
    record,
    pristine,
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
            redirect={`/tasks/${formData.taskId}`}
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
  const [killTimer, setKillTimer] = React.useState(0);

  const [currentTaskId, setCurrentTaskId] = React.useState(null);

  const {
    data: comments,
    total,
    loaded,
  } = useGetList(
    'comments',
    { page: 1, perPage: -1 },
    { field: 'id', order: 'ASC' },
    { userId: authUser.uid, commentable: true }
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
    notify(`Возникла ошибка: ${error}`, { type: 'warning' }); // default message is 'ra.notification.created'
    refresh();
  };

  const handleUpdateTaskId = () => {
    if (localStorage.getItem('currentTaskId') && !currentTaskId) {
      setCurrentTaskId(localStorage.getItem('currentTaskId'));
      console.log(
        localStorage.getItem('currentTaskId'),
        'currentTaskId changed'
      );
      localStorage.removeItem('currentTaskId');
      clearTimeout(killTimer);
    }
  };

  React.useEffect(() => {
    setKillTimer(setInterval(() => handleUpdateTaskId(), 1000));
    return () => {
      clearTimeout(killTimer);
    };
  }, []);

  return (
    <>
      {authUser && (
        <Create
          {...props}
          key={currentTaskId}
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
                <h3 className="titleDialog">Создание комментария </h3>
              )}
            />

            <TextInput
              label="Описание"
              source="description"
              validate={validateDescription}
              defaultValue={'Текст описания к задаче'}
            />

            {loaded && (
              <ReferenceInput
                label="Комментируемая задача"
                defaultValue={currentTaskId}
                allowEmpty={false}
                source="taskId"
                reference="tasks"
                filter={total > 0 ? { id_nar: Object.keys(comments) } : {}}
                validate={required(
                  total > 0
                    ? 'Задача не должна иметь комментариев пользователя'
                    : 'Необходимо выбрать задачу  для комментария'
                )}
                sort={{ field: 'title', order: 'ASC' }}
              >
                <SelectInput
                  optionText={(choise) => (
                    <TaskForCommentSelector {...choise} />
                  )}
                  helperText={'Выберите задачу для комментирования'}
                />
              </ReferenceInput>
            )}
            {!loaded && <CircularProgress color="inherit" />}

            <RichTextInput
              label="Комментарий"
              source="body"
              validate={validateBody}
              defaultValue={'Комментарий к задаче'}
              helperText="Введите текст комментария"
            />
          </SimpleForm>
        </Create>
      )}
    </>
  );
};
