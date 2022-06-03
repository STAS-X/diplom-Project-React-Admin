import React from 'react';
import { Typography } from '@material-ui/core';
import './rotation.css';
import { getRandomInt } from '../../../utils/getRandomInt';

const RotationWords = () => {
  const animation='_rubberBand';
  let words = null;
  let wordArray = [];
  let currentWord = 0;

  const changeWord = () => {
    const cw = wordArray[currentWord];
    const nw =
      currentWord == words.length - 1
        ? wordArray[0]
        : wordArray[currentWord + 1];

    for (let i = 0; i < cw.length; i++) {
      animateLetterOut(cw, i);
    }

    for (let i = 0; i < nw.length; i++) {
      nw[i].className = 'letter behind';
      nw[0].parentElement.style.opacity = 1;
      animateLetterIn(nw, i);
    }

    currentWord = currentWord == wordArray.length - 1 ? 0 : currentWord + 1;
  };

  const animateLetterOut = (cw, i) => {
    setTimeout(() => (cw[i].className = 'letter out'), i * 80);
  };

  const animateLetterIn = (nw, i) => {
    setTimeout(() => (nw[i].className = 'letter in'), 1500 + i * 80);
  };

  const splitLetters = (word) => {
    const content = word.innerHTML;
    word.innerHTML = '';
    const letters = [];
    for (let i = 0; i < content.length; i++) {
      const letter = document.createElement('span');
      letter.className = 'letter';
      letter.innerHTML =
        content.charAt(i) === ' ' ? '&nbsp;' : content.charAt(i);
      word.appendChild(letter);
      letters.push(letter);
    }

    wordArray.push(letters);
  };

  const handleAnimationEnd = (e) => {
        e.stopPropagation();
        e.target.classList.remove(
          'animate__animated',
          `animate_${animation}`,
          'animate__fast'
        );
  };


  const animateWord = () => {
    if (getRandomInt(0,1) === 1) {
      const container = document.getElementsByClassName('textRotation')[0];
      container.addEventListener('animationend', handleAnimationEnd, {once:true});
      container.classList.add(
          'animate__animated',
          `animate_${animation}`,
          'animate__fast'
        );
   };
  };

  React.useEffect(() => {
    words = document.getElementsByClassName('word');
    words[currentWord].style.opacity = 1;
    for (let i = 0; i < words.length; i++) {
      splitLetters(words[i]);
    }
    changeWord();
    const changeTimer = setInterval(changeWord, 7000);
    const animateTimer = setInterval(animateWord, 7000);

    return () => {
      clearTimeout(changeTimer);
      clearTimeout(animateTimer);
    }
  }, []);

  return (
    <div className="textRotation">
      <p>Выражаю благодарность:&nbsp;</p>
      <p className="textWrapper">
        <span className="word wisteria">
          Коллективу онлайн школы @RESULT school
        </span>
        <span className="word dodger">
          Кураторам и координаторам FRONTEND Developer
        </span>
        <span className="word midnight">
          Коллегам по обучению (Анне Потаповой в частности :)
        </span>
        <span className="word pomegranate">Василию Мельникову</span>
        <span className="word aqua">Всем участникам учебного процесса!</span>
        <span className="word green">Владилену Минину</span>
      </p>
    </div>
  );
};

export default RotationWords;
