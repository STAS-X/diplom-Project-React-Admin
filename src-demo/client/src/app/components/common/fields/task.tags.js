import * as React from 'react';
import {
    SelectArrayInput,
    Create,
    SimpleForm,
    useGetOne,
    required,
    useEdit,
    useCreateSuggestionContext
} from 'react-admin';
import BasicModal from './basicmodal.js'

import {
    Box,
    BoxProps,
    Button,
    InputAdornment,
    Chip,
    Stack,
    Slide,
    SimpleDialog,
    Dialog,
    DialogTitle, 
    DialogActions,
    DialogContent,
    TextField,
    CircularProgress
} from '@mui/material';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

const TagsField = ({keywords}) => {

    const [inputKeys] = React.useState(keywords?keywords.split(',').length:3)
    const [choices, setChoices] = React.useState(keywords?keywords.split(',').map((key, index)=> { return {id: index, name: key}}):[{id: 1, name:'Важно!'}, {id: 2, name:'Сделано'}, {id: 3, name:'НЕТ***НЕ'}]);
    const [open, setOpen] = React.useState(false);
    const [count, setCount] = React.useState(0);

    return (
        <Stack direction="row" display="inline-grid" >
            <SelectArrayInput label="Тэги задачи" optionValue="name" choices={choices} onChange={({target})=>setCount(Array.isArray(target.value)?target.value.length:0)} optionText={(choise) => <TagChip tag={choise} count={count}/>} source="keywords" />
            <Stack direction="row" display="inline-flex" justifyContent="space-around" >
                <Button startIcon={<AddIcon/>} sx={{width: '45%', mb: 3}} variant="contained" onClick={()=> setOpen(true)}>Добавить</Button>
                <Button startIcon={<DeleteIcon/>} disabled={!(choices.length>inputKeys)} sx={{width: '45%', mb: 3}} variant="contained" onClick={()=>setChoices(prevChoices => { const newChoices=prevChoices.length>0?prevChoices.slice(0,inputKeys):prevChoices;
                                                                                                                                        return newChoices})}>Удалить</Button>
            </Stack>
            <CreateNewTagDialog open={open} setOpen={setOpen} setChoices={setChoices} />
        </Stack>
    );
};

const TagChip = ({tag, count}) => {
    return (
        <Chip
            label={tag.name}
            sx={{
                fontWeight: 'bold',
                fontSize: 14,
                'span:after': {content: count > 2 ? '" ✔️"': '" 😐"' },

            }}
      />
    )
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateNewTagDialog = ({open, setOpen, setChoices}) => {
    //const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState('');
    //const [create] = useCreate();


    const checkIsValid = (value) => {
        if (value && value.length<=10) return true;
        return false
    }

    const handleCancel = event => {
        event.preventDefault();
        setValue('');
        setOpen(false);
    };

    const handleSubmit = event => {
        event.preventDefault();
        setChoices(prevChoices => { prevChoices.push({id: prevChoices.length+1, name: value})
                                    return prevChoices})
        setValue('');
        setOpen(false);
    };

    return (
        <Dialog open={open} keepMounted TransitionComponent={Transition} 
                aria-describedby="alert-dialog-slide-description"
                style={{bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,}}>
                <DialogTitle sx={{ mb: 1 }}>{"Добавить новый тэг"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Введите тэг"
                        error={!checkIsValid(value)}
                        value={value}
                        onChange={event => setValue(event.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">#</InputAdornment>,
                        }}
                        helperText={checkIsValid(value)?'Текст тэга':'Допустимо до 10 символов'}
                        sx={{ m: 0.5 }}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button disabled={!checkIsValid(value)} onClick={handleSubmit}>Добавить</Button>
                    <Button onClick={handleCancel}>Отменить</Button>
                </DialogActions>
        </Dialog>

    );
};

export default TagsField;