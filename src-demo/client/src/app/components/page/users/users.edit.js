import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Edit,
  DateInput,
  SaveButton,
  EditButton,
  SimpleForm,
  TextInput,
  EmailField,
  ImageField,
  DateField,
  FunctionField,
  TextField,
  NumberInput,
  useNotify,
  Toolbar,
  useRefresh,
  useEditContext,
  required,
  minLength,
  maxLength,
  minValue,
  maxValue,
  number,
} from 'react-admin';
import { Stack, Button } from '@mui/material';
import { ReorderRounded, PortraitRounded } from '@material-ui/icons';
import { getAuthData } from '../../../store/authcontext';
import { nanoid } from 'nanoid';
import { dateFormatter } from '../../../utils/displayDate';

const CustomToolbar = ({ authId, ...props }) => {
  //const notify = useNotify();
  //const redirect = useRedirect();
  //const refresh = useRefresh();
  const {
    invalid: isInvalid,
    pristine,
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
        label="Сохранить"
        onClick={() => {
          handleSubmit();
          //setOnSuccess(handleSuccess);
        }}
        redirect={'show'}
        disabled={(isInvalid || pristine) && record.id !== authId}
      />
    </Toolbar>
  );
};

const validateFio = [
  required('Необходимо ввести ФИО'),
  minLength(3, 'ФИО должно быть более 3-х символов'),
];
const validateAge = [
  required('Необходимо указать возраст'),
  minValue(10, 'Не может быть меньше 10 лет'),
  maxValue(100, 'Не может быть больше 100 лет'),
];

const MyProfileImage = ({ transform, authURL, profileURL, setProfileURL }) => {
  const { record, setTransform } = useEditContext();
  console.log(record, 'from context');

  if (!profileURL) {
    const newURL = {
      picture: [{ url: record.url, desc: 'Фото' }],
    };
    setProfileURL(newURL);
  }

  const handleClick = (isProfile) => {
    if (isProfile) {
      const newURL = {
        picture: [
          {
            url: authURL,
            desc: 'Фото',
          },
        ],
      };
      setProfileURL(newURL);
      setTransform(transform(authURL));      
    } else {
      const newURL = {
        picture: [
          {
            url: `https://i.pravatar.cc/300?u=${nanoid(10)}`,
            desc: 'Фото',
          },
        ],
      };
      setProfileURL(newURL);
      setTransform(transform(newURL.picture[0].url));
    }
  };

  return (
    <Stack
      direction="row"
      display="inline-flex"
      sx={{
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        '& img': { width: 350, height: 350, maxHeight: 350 },
      }}
    >
      <ImageField record={profileURL} source="picture" src="url" title="desc" />
      <Button
        variant="text"
        color="primary"
        startIcon={<ReorderRounded />}
        onClick={() => handleClick(false)}
      >
        Случайно
      </Button>
      <Button
        variant="text"
        color="primary"
        startIcon={<PortraitRounded />}
        onClick={() => handleClick(true)}
      >
        Из профиля
      </Button>
    </Stack>
  );
};

export const UserEdit = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();

  //const rec= useRecordContext();
  //const fstate = useFormState();
  //console.log(fstate, 'get state of form')
  const { user: authUser } = useSelector(getAuthData());

  const [profileURL, setProfileURL] = React.useState(null);

  const handleFailure = (error) => {
    notify(`Возникла ошибка: ${error}`, { type: 'warning' }); // default message is 'ra.notification.created'
    refresh();
  };

  const transform = (newUrl) => (data) => {
    console.log(data, newUrl, 'transform data from edit');
    return {
      ...data,
      url: newUrl ? newUrl : data.url,
    };
  };

  return (
    <>
      {authUser && (
        <Edit
          {...props}
          mutationMode="undoable"
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
                  Редактирование профиля пользователя #{record.name}{' '}
                </h3>
              )}
            />

            <TextField disabled label="Идентификатор" source="id" />

            <MyProfileImage
              label="Фото профиля"
              record={props}
              profileURL={profileURL}
              authURL={authUser.url}
              transform={transform}
              setProfileURL={setProfileURL}
            />

            <TextInput
              label="ФИО"
              source="name"
              validate={validateFio}
              defaultValue={'John Dow'}
            />

            <NumberInput
              label="Возраст"
              source="age"
              step={5}
              validate={validateAge}
              defaultValue={20}
            />
            <TextField disabled label="Авторизация" source="providerId" />
            <DateInput
              disabled
              label="Создан"
              source="createdAt"
              parse={dateFormatter}
              //defaultValue={dateFormatter(new Date())}
            />
            <EmailField label="Логин" source="email" />

            <DateField
              locales="ru-Ru"
              showTime={true}
              options={{ dateStyle: 'long', timeStyle: 'medium' }}
              label="Ранее входил"
              source="lastLogOut"
              //parse={dateFormatter}
              //defaultValue={dateFormatter(new Date())}
            />
          </SimpleForm>
        </Edit>
      )}
    </>
  );
};
