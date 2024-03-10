import React,{useState} from "react";
import Button from "@mui/joy/Button";
import '../style.css'
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Grid,
} from "@mui/material";

import { styled } from "@mui/material/styles";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { pink } from "@mui/material/colors";

import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import { Typography } from "@mui/material";
import BucketListItem from "./BucketListItem";

const todos = [
  {
    id:"1",
    name: "harry",
    desc: "ehehhehehe",
    select: "gegege",
    priority: "high",
    completed:false
  },
  {
    id:"2",
    name: "peter",
    desc: "ehehhehehe",
    select: "gegege",
    priority: "medium",
    completed:true
  },
  {
    id:"3",
    name: "Mj",
    desc: "ehehhehehe",
    select: "gegege",
    priority: "high",
    completed:false
  },
  {
    id:"4",
    name: "green goblin",
    desc: "ehehhehehe",
    select: "gegege",
    priority: "low",
    completed:false
  },
  {
    id:"5",
    name: "venom",
    desc: "ehehhehehe",
    select: "gegege",
    priority: "low",
    completed:false
  },
  {
    id:"6",
    name: "octavius",
    desc: "ehehhehehe",
    select: "gegege",
    priority: "low",
    completed:false
  },
  {
    id:"7",
    name: "sandman",
    desc: "ehehhehehe",
    select: "gegege",
    priority: "low",
    completed:false
  },
  {
    id:"8",
    name: "ben",
    desc: "ehehhehehe",
    select: "gegege",
    priority: "low",
    completed:false
  },
];
const BucketList = () => {
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = useState("all"); // State to track filtering
  const [activeButton, setActiveButton] = useState('all');
  const CustomButton = styled(Button)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,

  }));

  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    select: "",
    priority: "low",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Reset form data if needed
    setFormData({
      name: "",
      desc: "",
      select: "",
      priority: "low",
    });
  };
  const filterTodos = (status) => {
    setFilter(status);
  };

  const handleFilterButtonClick = (status) => {
    setFilter(status);
    setActiveButton(status);
  };

  // Filter the todos based on completion status
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") {
      return todo.completed === true;
    } else if (filter === "incomplete") {
      return todo.completed !== true;
    }
    return true;
  });
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          paddingTop: "6rem",
          paddingBottom: "9rem",
          backgroundColor: "#e73758",
          width: "100vw",
        }}
      >
        <div style={{ padding: "0 20px" }}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Typography
              sx={{ color: "#fff", textTransform: "uppercase" }}
              variant="h5"
              component="h2"
            >
              Bucket List
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: "#fff",
                padding: "10px 30px",
                borderRadius: "15px",
              }}
            >
              Add task
            </Button>
          </Stack>
        </div>
        <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <DialogTitle>Add task</DialogTitle>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                autoFocus
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                name="desc"
                value={formData.desc}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl>
              <InputLabel id="select-menu">Select Category</InputLabel>
              <Select
                labelId="select-menu"
                id="demo-simple-select-helper"
                label="Select Category"
                name="select"
                value={formData.select}
                onChange={handleInputChange}
              >
                <MenuItem value={"study"}>Study</MenuItem>
                <MenuItem value={"learn new skill"}>Learn new Skill</MenuItem>
                <MenuItem value={"go out"}>Go out</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel id="job-experience-group-label">Select Priority</FormLabel>
              <RadioGroup
                row
                aria-labelledby="job-experience-group-label"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  labelPlacement="start"
                  value="high"
                  control={<Radio size="small" color="secondary" />}
                  label="High"
                />
                <FormControlLabel
                  labelPlacement="start"
                  value="medium"
                  control={<Radio size="small" color="secondary" />}
                  label="Medium"
                />
                <FormControlLabel
                  labelPlacement="start"
                  value="low"
                  control={<Radio size="small" color="success" />}
                  label="Low"
                />
              </RadioGroup>
            </FormControl>
            <Button type="submit" sx={{ backgroundColor: "rgb(231, 55, 88)" }}>
              Save
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
      </div>
      <div
        className="todo_list_container"
        style={{
          position: "fixed",
          top: "20%",
          borderRadius: "30px 0  0  0",
          backgroundColor: "white",
          width: "100vw",
          padding: "30px 20px",
          // overflowY: "scroll",
          maxHeight: "calc(100vh)",
        }}
      >
        
        <div>
        <Stack direction="row" spacing={2} sx={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
        <CustomButton onClick={() => handleFilterButtonClick("all")}  
        sx={{
          backgroundColor: activeButton === "all" ? "#fff" : "transparent",
          padding: "10px 30px",
          borderBottom: activeButton === "all" ? "2px solid red" : "2px solid #CFCFCF",
          transition: "background-color 0.3s ease-in-out, border-bottom 0.3s ease-in-out",
          boxShadow: "rgba(50, 50, 93, 0.1) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
        }}
        >All</CustomButton>
        <CustomButton onClick={() => handleFilterButtonClick("completed")}
        sx={{
          backgroundColor: activeButton === "completed" ? "#fff" : "transparent",
          padding: "10px 30px",
          borderBottom: activeButton === "completed" ? "2px solid red" : "2px solid #CFCFCF",
          transition: "background-color 0.3s ease-in-out, border-bottom 0.3s ease-in-out",
          boxShadow: "rgba(50, 50, 93, 0.1) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
        }}
        >Completed</CustomButton>
        <CustomButton onClick={() => handleFilterButtonClick("incomplete")}
        sx={{
          backgroundColor: activeButton === "incomplete" ? "#fff" : "transparent",
          padding: "10px 30px",
          borderBottom: activeButton === "incomplete" ? "2px solid red" : "2px solid #CFCFCF",
          transition: "background-color 0.3s ease-in-out, border-bottom 0.3s ease-in-out",
          boxShadow: "rgba(50, 50, 93, 0.1) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
        }}
        >Incomplete</CustomButton>
      </Stack>
        </div>
       <ul style={{padding:"0", backgroundColor:""}}>

       <Grid container spacing={2}>
            <Grid item xs={12}>
              <BucketListItem todos={filteredTodos}></BucketListItem>
            </Grid>
          </Grid>       </ul>
      </div>
    </div>
  );
};

export default BucketList;
