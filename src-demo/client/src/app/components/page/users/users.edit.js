import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  useRedirect,
  useEditContext,
  FormDataConsumer,
  required,
  minLength,
  maxLength,
  minValue,
  maxValue,
  number,
} from 'react-admin';
import { Stack, Button } from '@mui/material';
import { Repeat as PlayRounded, PortraitRounded } from '@material-ui/icons';
import { getAuthData, setAuthUser } from '../../../store/authcontext';
import { nanoid } from 'nanoid';
import { dateFormatter } from '../../../utils/displayDate';
import { getRandomInt } from '../../../utils/getRandomInt';

const CustomToolbar = ({ authUser, profileURL, ...props }) => {
  //const notify = useNotify();
  //const redirect = useRedirect();
  const dispatch = useDispatch();
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
      <FormDataConsumer>
        {({ formData }) => (
          <SaveButton
            label="Сохранить"
            onClick={() => {
              handleSubmit();
              dispatch(
                setAuthUser({
                  ...authUser,
                  age: formData.age,
                  name: formData.name,
                  url: profileURL.picture[0].url,
                })
              );
              //setOnSuccess(handleSuccess);
            }}
            redirect={'show'}
            handleSubmitWithRedirect={() => {}}
            disabled={
              record.id === authUser.uid
                ? isInvalid ||
                  (pristine && profileURL?.picture[0].url === formData.url)
                : true
            }
          />
        )}
      </FormDataConsumer>
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
  const avatarsUrl = [
    'https://avatars.dicebear.com/api/avataaars/',
    'https://i.pravatar.cc/300?u=',
  ];

  React.useEffect(() => {
    if (!profileURL) {
      const newURL = {
        picture: [{ url: record.url, desc: 'Фото' }],
      };
      setProfileURL(newURL);
    }
    return () => {};
  }, [profileURL]);

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
            url: `${avatarsUrl[getRandomInt(0, 1)]}${nanoid(21)}.svg`,
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
        startIcon={<PlayRounded />}
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
  const redirect = useRedirect();

  const { id: editUserId } = props;
  const { user: authUser } = useSelector(getAuthData());

  const [profileURL, setProfileURL] = React.useState(null);

  const handleFailure = (error) => {
    notify(`Возникла ошибка: ${error}`, { type: 'warning' }); // default message is 'ra.notification.created'
    refresh();
  };

  const transform = (newUrl) => (data) => {
    return {
      ...data,
      url: newUrl ? newUrl : data.url,
    };
  };

  React.useEffect(() => {
    if (authUser.uid !== editUserId)
      setTimeout(() => redirect('show', '/users', editUserId), 0);

    return () => {};
  }, []);

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
            toolbar={
              <CustomToolbar authUser={authUser} profileURL={profileURL} />
            }
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
              source="url"
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
