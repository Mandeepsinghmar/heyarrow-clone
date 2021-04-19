import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_MARKETING } from '../../../constants';

const FormDialog = (createProps) => {
  const { isOpen } = createProps;
  const [open, setOpen] = React.useState(isOpen);
  const [foldername, setFolderName] = React.useState('');

  const handleClose = () => {
    setOpen(false);
    createProps.setopenModal(false);
  };
  const onChange = (event) => {
    setFolderName(event.target.value);
  };
  const CreateTagApi = () => {
    axios
      .post(`${API_MARKETING}/create-folder`, { folderName: foldername }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success('Your folder added succesfully.');
          setOpen(false);
          createProps.setopenModal(false);
          createProps.CallFolderApi();
        }
      })
      .catch((error) => {
        toast.error(error);
        setOpen(false);
        createProps.setopenModal(false);
      });
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="foldername"
            placeholder="Folder Name"
            type="text"
            value={foldername}
            onChange={onChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={CreateTagApi} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default FormDialog;
