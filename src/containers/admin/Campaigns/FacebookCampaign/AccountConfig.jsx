import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_MARKETING } from '../../../../constants';

const FormDialog = (createProps) => {
  const { isOpen, config } = createProps;
  const [open, setOpen] = React.useState(isOpen);
  const [email, setEmail] = React.useState('');
  const [Adaccount, setAdAccount] = React.useState('');
  const [Pageurl, setPageurl] = React.useState('');

  const handleClose = () => {
    setOpen(false);
    createProps.setopenModal(false);
  };
  const sendFBConfigApi = () => {
    if (email === '') {
      toast.error('Please enter your email.');
    } else if (Pageurl === '') {
      toast.error('Please enter your page url.');
    } else if (Adaccount === '') {
      toast.error('Please enter your ad account id.');
    } else {
      axios
        .post(`${API_MARKETING}/create-folder`, { email, page: Pageurl, adaccount: Adaccount }, {
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
    }
  };
  const ResendLink = () => {
    toast.success('resend link');
  };
  return (
    <div>
      {config === 'config'
        ? (
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Facebook Account Configuration Settings</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.value)}
                fullWidth
              />
            </DialogContent>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="Adaccount"
                placeholder="Ad Account Id"
                type="text"
                value={Adaccount}
                onChange={(e) => setAdAccount(e.value)}
                fullWidth
              />
            </DialogContent>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="PageUrl"
                placeholder="Page URL"
                type="text"
                value={Pageurl}
                onChange={(e) => setPageurl(e.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={sendFBConfigApi} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        )
        : (
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Please accept request.</DialogTitle>
            <DialogContent>
              If you are not receiving email
              , Please
              <a style={{ color: 'blue' }} onClick={ResendLink}> click here</a>
              {' '}
              to receive the request link again.
            </DialogContent>
          </Dialog>
        )}
    </div>
  );
};
export default FormDialog;
