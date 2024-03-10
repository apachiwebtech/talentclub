import { Stack, Paper } from "@mui/material";
import React,{useState} from "react";
import { styled } from "@mui/material/styles";
import '../style.css'
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import '../style.css'


const BucketListItem =(props)=>{
    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [todos, setTodos] = useState(props.todos);

    const toggleCompleted = (id) => {
        const updatedTodos = todos.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        );
        setTodos(updatedTodos);
      };
    const Item = styled(Paper)(({ theme, priority }) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        ...theme.typography.body2,
        padding: theme.spacing(1),
        height: 80,
        color: theme.palette.text.secondary,
        display: "flex",
        // flexGrow: 1,
        justifyContent: "space-between", // Align items with space between them
        "& p": {
          margin: "0", // Remove default margin for <p> tags
        },
        '& input[type="checkbox"]': {
          marginRight: "10px",
          marginLeft: "10px",
          width: "20px",
          height: "20px",
          flex: "0 0 auto", // Prevent checkbox from stretching
          alignSelf: "center", // Vertically center the checkbox
        },
        borderLeft: `10px solid ${getItemBorderColor(priority)}`, // Dynamic left border color
      }));

      const getItemBorderColor = (priority) => {
        switch (priority) {
          case "high":
            return "#f50057";
          case "medium":
            return "#33bfff";
          case "low":
            return "#33eb91";
          default:
            return "#dad9d8"; // Default color or no color
        }
      };
return(
    
    <div className="list" style={{  maxHeight: "60vh", overflowY: "scroll", width:"100%", padding:"10px 0"}}>

    <Stack
    className="todo_list"
    spacing={2}
    sx={{ height: "100%",
    overflowY: "scroll", // Ensure overflow is scrollable
    marginRight:"20px",padding:"10px 0"
  }}
    
  >
    {props.todos.map((item) => (
        <Grid item xs={12} key={item.id}>
          <Item
            elevation={2}
            square={false}
            priority={item.priority}
            sx={{ listStyle: "none" }}
            style={{
              borderLeft: `10px solid ${getItemBorderColor(item.priority)}`,
              padding: isSmallScreen ? theme.spacing(1) : theme.spacing(2),
              height: isSmallScreen ? "auto" : 80,
            }}
          >
            <div>
              <h4>{item.name}</h4>
              <p>{item.desc}</p>
            </div>
            <input type="checkbox" 
            />
          </Item>
        </Grid>
      ))}
  </Stack>
        </div>
)
}

export default BucketListItem;