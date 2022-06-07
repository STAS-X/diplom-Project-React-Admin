import * as React from 'react';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import {
  CardHeader,
  CardContent,
  Box,
  Collapse,
  IconButton,
  Avatar,
  Typography,
} from '@mui/material';
import {
  MoreHorizOutlined as MoreIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import { red } from '@mui/material/colors';
import { getRandomInt } from '../../utils/getRandomInt';

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

const DashBordPage = () => {
  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleChangeBackground = () => {
    
    const deltaX = getRandomInt(-10,10);
    document.documentElement.style.setProperty('--bg-width', `${deltaX === 0? 50:deltaX*50}px`);
    const deltaY = getRandomInt(-10, 10);
    document.documentElement.style.setProperty(
      '--bg-height',
      `${deltaY === 0 ? 50 : deltaY * 50}px`
    );    

  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            PR
          </Avatar>
        }
        action={
          <IconButton
            aria-label="settings"
            onClick={() => {
              const deltaX = getRandomInt(-5, 5);
              const deltaY = getRandomInt(-5, 5);
              const reverse = getRandomInt(0, 1);
              document.documentElement.style.setProperty(
                '--bg-width',
                `${(deltaX ===0?1:deltaX) * 50}px`
              );
              document.documentElement.style.setProperty(
                '--bg-height',
                `${(deltaY === 0 ? 1 : deltaY) * 50}px`
              );
              document.documentElement.style.setProperty(
                '--bg-direction',
                reverse === 0 ? 'bg-scrolling-reverse' : 'bg-scrolling'
              );
            }}
          >
            <MoreIcon />
          </IconButton>
        }
        title="Главная страница проекта"
        subheader="проект написан в 2022 году"
      />
      <CardContent style={{ position: 'relative' }}>
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
            display: 'inline-block',
            textAlign: 'left',
            padding: 0,
            margin: 0,
            marginLeft: 2,
          }}
        >
          Главная страница с краткими аннотациями
        </Typography>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography
            color="inherit"
            variant="body2"
            component="div"
            style={{ marginLeft: 10 }}
          >
            <p>
              В проекте задействованы следующие виды объектов:{' '}
              <cite>
                <strong>Пользователи, Задачи и Комментарии</strong>
              </cite>
              . После регистрации <cite>Пользователю </cite> становятся
              доступными возможности по созданию/обновениюи удалению остальных
              ресурсов при условии, что именно он их создатель. Проект
              предусматривает ограничения для работы неавторизанных
              пользователей, а также содержит запреты для работы с
              "несобственными" объектами. Формы заполнения/редактирования также
              содержат валидаторы для провекри корректности ввода данных, причем
              как первичного, так и промежуточного и конечного. Реализованы
              возможности{' '}
              <strong>сортировки, фильтрации и поиска данных</strong>,
              переключения режимов просмотра данных{' '}
              <strong>таблица/карточки</strong>, реализована возможность{' '}
              <strong>drag/drop</strong> и иные предусмотренны требованиями
              дипломного проект.
            </p>
          </Typography>
          <Typography
            color="#03a9f4"
            variant="h6"
            component="h4"
            sx={{ ml: 1.6, mt: 1 }}
          >
            Желаю приятного проведения времени и получения положительных эмоций!{' '}
            <br />
            Цитата дня:{' '}
            <cite>- Никогда не ошибается тот, кто ничего не делает.</cite>
            <sup> Теодор Рузвельт.</sup>
          </Typography>
        </Collapse>
        <Box
          className="animationMainBack"
          sx={{ mx: 1, my: 1, height: '75vh' }}
        ></Box>
      </CardContent>
    </Card>
  );
};

export default DashBordPage;
