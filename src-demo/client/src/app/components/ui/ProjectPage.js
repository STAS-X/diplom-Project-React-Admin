import * as React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Collapse,
  Typography,
  IconButton,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import CaruselTest from './carusel/Carusel';
import { red } from '@mui/material/colors';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ProjectPage = () => {
  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            RA
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Информация о проекте"
        subheader="проект написан в период март-май 2022 года"
      />
      <CardContent>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
        <Typography
          gutterBottom
          color="primary"
          variant="h6"
          style={{
            display:'inline-block',
            textAlign: 'left',
            padding: 0,
            margin: 0,
            marginLeft: 2,
          }}
          >
           Краткие аннотации к проекту
          </Typography>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
         <Typography
          color="inherit"
          variant="body2"
          component="div"
          style={{marginLeft:10}}
          >
            <p>Во время работы c проектом были задействованы следующие библиотеки и компоненты 
               библиотеки <strong>NPM</strong> (краткое перечисление): <cite> material-ui/core, material-ui/styles, material-ui/colors, 
               material-ui/component, react, react-redux, react-admin, 
               custom dataProvider, custom filter (search text by params), custom toolbar,
               hooks (with and without function component), styled component, 
               firebase-admin, firebase-rules, firebase-functions, express, express-validator, express-routing  </cite> и многие другие.</p>
            <p>Кратко рассмотрим основные составляющие проекта. На главной странице представлены несколько пользовательских меню,
               помогающие ориентироваться в навигации по карте проекта для перехода между его составляющими <cite>ресурсами:</cite> 
               <strong> Пользователи, Задачи, Комментарии.</strong> Основная идея заключается в том, чтобы пользователь после регистрации
               на странице входа в проект <cite>(необходимо выбрать провайдера входа между <strong>GOOGLE и EMAIL</strong>, также доступна возможность поменять забытый пароль)</cite>
               получает доступ к управлению всеми указанными ресурсами с возможностью добавлять/удалять/изменять их <cite>(если он является их создателем)</cite>. Таким образом пользователь может получить так называемый 
               <cite>"защищенный доступ только для авторизованных участников"</cite>. Удаление недоступно для только для пользователя,
               для всех остальных категирий ресурсов такая возможность есть. При создании того или иного ресурса добавлена возможность валидации значений вводимых полей элементов <cite>"на лету".</cite>
               При реализации валидации использовались встроенные в поля <u><strong>react-admin</strong></u> возможности, также реализованы нестандартные функции валидирования.
               Помимо валидации контроль вводимых значений полей происходит на всех стадиях ввода: на этапе получения значений в форму, на этапе ввода, на этапе вывода значения в форму.
               Реализованы возможности по указанию различных аспектов задачи, такие как дата исполнения, указать исполнителей, сменить статус выполнения, задать комментирование, задать теги для будущего поиска и т.д.
            </p>
            <p>
               Получить представление ресурса можно в следующих форматах: <strong><cite>на листе и карточки</cite></strong>. Вид "карточки" по умолчанию имеет возможность <cite>drag-drop (библиотека react-beautiful-dnd)</cite>
               внутри так называемого <strong>DropContextContainer</strong>. На панели задач (toolbar) вверху странице есть возможность быстро переключить возможности для более комфортной работы с ресурсами: 
               <cite>переключение видов показа (лист/карточки), "оцвечивание" данных, показать нестандартный "лоадер" при загрузке, переключение между темной и светлой темами.</cite>
            </p>
            <p>
              Несколько слов о реализации. Центриальным элементом проекта по сути является <strong>react-admin/admin</strong>. Помимо него, конечно, не обошлось без стандартных форм ввода <cite>(create form context)</cite>, показа <cite>(show form context)</cite> и редактирования <cite>(edit form context)</cite>.
              Проверка данных на "корректность" происходит на клиенте <strong>(frontend)</strong>, при передаче данных на сервер <strong>(express-validation middleware)</strong> и непосредственно перед загрузкой в базу данных (Firebase Firestore DB). Проверка прав пользователя <strong>(permission)</strong> происходит на этапе первичной регистрации 
              <cite>(auth provider firebase-admin)</cite>, внутри проекта, где проверяется владелец ресурса перед разрешением на редактирование и во время записи данных в базу <strong>(firebase store rules)</strong>.
            </p>
         </Typography>
         <Typography
          color="inherit"
          variant="body1"
          component="div"
          style={{marginLeft:10}}
          >
            <p>При написании проекта использовались (не)стандартные диалоги <strong>material-ui</strong>, написан пользовательский <strong>dataProvider</strong> с возможностью фильтрации и контекстного поиска данных <cite>(не было в стандартных возможностях)</cite>, стилизация и тематизация компонентов <cite>(styled component && custom theme)</cite>,
               управление компонентами через динамические ссылки <cite>(useRef)</cite>, использование хуков по диспетчеризации <cite>action задач</cite> вне функциональных компонентов <strong>(hook-outside)</strong>, передача данных между компоеннтами проекта на глобальном уровне <strong>(react-redux)</strong>, 
               при работе с базой данных использовалась библиотека <strong>react-admin-firebase</strong> (функционал по работе брался из стандартной документации на сайте), разметка объектов построена по типу <cite>"inline-flex"</cite> и многое другое.
            </p>
         </Typography>
         <Typography
          color="#03a9f4"
          variant="h6"
          component="h4"
          sx={{ml:1.6}}
          >
            <p>Выражаю благодарность за труд и c пользой проведённое на курсах <strong>React Frontend Developer</strong> время всему колективу школы <cite>@RESULT school</cite> и ее идейному вдохновителю <b>&laquo;Владилену Минину&raquo;</b>.</p>
            <p><cite><u>Успешного дня и благодарю за потраченное на ознакомление с проектом время, надеюсь вы сможете найти здесь что-то новое, интересное и полезное для последующего изучения и дальнейшего использования!</u></cite></p>
          </Typography>

        </Collapse>

        <CaruselTest />
      </CardContent>
    </Card>
  );
};

export default ProjectPage;
