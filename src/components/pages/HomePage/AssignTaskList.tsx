import { Button, List, ListItemButton, IconButton, ListItemIcon, Paper, Typography, Menu, MenuItem, Tab, Tabs, Box, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import InfoIcon from "@mui/icons-material/Info";
import DoneIcon from "@mui/icons-material/Done";
import PendingIcon from "@mui/icons-material/Pending";
import Construction from "@mui/icons-material/ConstructionOutlined";

import ColoredCircle from "~/components/common/ColoredCircle/ColoredCircle";
import ArrowDelimiter from "~/components/common/Separator/ArrowDelimiter";
import { useAuth } from "~/context";
import { getUserTaskAssign, getUserDoneTaskAssign, getTaskStatus, updateSatusOfTask } from "~/utils/zou"
import { Task, TaskStatus } from "~/types/entities";


const AssignTaskList = (): JSX.Element => {
  
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const actionMenuButton = useRef<HTMLButtonElement>(null)
  const [mouseOver, setMouseOver] = useState<boolean>();
  const [somethingChange, setSomethingChange] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<string>("one")
  const [taskStatus, setTaskStatus] = useState<TaskStatus[]>([])

  const[assignTasks, setAssignTasks] = useState<Task[]>([])
  const [doneTasks, setDoneTasks] = useState<Task[]>([])
  const [displayTasks, setDisplayTasks] = useState<Task[]>([])

  const {user} = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) =>{
    setTabValue(newValue);
  };

  const handleclick =() =>{
    setSomethingChange(!somethingChange)
  }
  
  const handleStopPropagation = (event: React.MouseEvent<HTMLElement>) => {
    // Stop propagation of onClick event because buttons are overlaping
    event.stopPropagation();
    
  };

  useEffect(()=>{
    getUserTaskAssign(user?.id as string).then((response) =>{
      setAssignTasks(response.data)
      setDisplayTasks(response.data.filter((task) => {
        return task.task_status_name === "Todo"
      }))
      console.log(assignTasks)
    }) 
    getUserDoneTaskAssign(user?.id as string).then((response) =>{
      setDoneTasks(response.data)
    })
    getTaskStatus().then((response)=> {
      setTaskStatus(response.data)
    })
  },[])

  useEffect(()=>{
    switch(tabValue){
      case "one":
        setDisplayTasks(assignTasks.filter(task =>{
          return task.task_status_name === "Todo"
        }))
        break;
      case "two":
        setDisplayTasks(assignTasks.filter(task=>{
          return task.task_status_name === "Work In Progress"
        }))
        break;
      case "three":
        setDisplayTasks((displayTasks) => Object.assign(doneTasks) )
        break;
      default:
        return undefined;
    }
  }, [tabValue, somethingChange])

  const doneStatus:TaskStatus[] = taskStatus.filter(taskStatus =>{
    const test = taskStatus.short_name === "done"
    return test
  })
  const wipStatus: TaskStatus[] = taskStatus.filter(taskStatus =>{
    const test = taskStatus.short_name === "wip"
    return test
  })
  const todoStatus: TaskStatus[] = taskStatus.filter(taskStatus =>{
    const test = taskStatus["name"] === "Todo"
    return test
  })

  function TodoButton({taskId, index}: {taskId:string, index: number}){
    return (
      <Tooltip title="change status to TO DO">
        <IconButton onClick={(event: React.MouseEvent<HTMLElement>) =>{
          handleStopPropagation(event)
          const clickedTask: Task = displayTasks[index]
          clickedTask.task_status_name = "Todo"
          setDisplayTasks(() => displayTasks.filter(a => a.id !== taskId))
          updateSatusOfTask(taskId, todoStatus[0]["id"])
          handleclick()
        }}>
          <PendingIcon color="disabled" fontSize="small"></PendingIcon>
        </IconButton>
      </Tooltip>
    )
  }
  function WipButton({taskId, index}: {taskId:string, index: number}){
    return (
      <Tooltip title="change status to WIP">
        <IconButton onClick={(event: React.MouseEvent<HTMLElement>) =>{
          handleStopPropagation(event)
          const clickedTask: Task = displayTasks[index]
          clickedTask.task_status_name = "Work In Progress"
          setDisplayTasks(() => displayTasks.filter(a => a.id !== taskId))
          updateSatusOfTask(taskId, wipStatus[0]["id"])
        }}>
          <Construction color="disabled" fontSize="small"></Construction>
        </IconButton>
      </Tooltip>
    )
  }
  function DoneButton({taskId , index}: {taskId:string, index:number}){
    return (
      <Tooltip title="change status to DONE">
        <IconButton onClick={(event: React.MouseEvent<HTMLElement>) => {
          handleStopPropagation(event)
          const clickedTask: Task = displayTasks[index]
          setDisplayTasks(() => displayTasks.filter(a => a.id !== taskId))
          setDoneTasks([...doneTasks, clickedTask])
          updateSatusOfTask(taskId, doneStatus[0]["id"])
        }}>
          <DoneIcon color="disabled" fontSize="small"></DoneIcon>
        </IconButton>
      </Tooltip>
    )
  }

  function BarIcon({taskId, index}:{taskId:string, index:number}) {
    switch(tabValue){
      case "one":
        return(
          <div>
            <WipButton taskId={taskId} index={index}/>
            <DoneButton taskId={taskId} index={index}/>
          </div>
        )
        break;
      case "two":
        return(
          <div>
            <TodoButton taskId={taskId} index={index}/>
            <DoneButton taskId={taskId} index={index}/>
          </div>
        )
        break;
      case "three":
        return(
          <div>
            <TodoButton taskId={taskId} index={index}/>
            <WipButton taskId={taskId} index={index}/>
          </div>
        )
        break;
      default:
        return null; 
    }
  }
  return (
    <div>
      <Typography sx={{ mb: 2 }}>Assign tasks:</Typography>
      <Box sx={{mb: 2}}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{ style: {background: "#54ae6a"}}}
          textColor="secondary"
          indicatorColor="primary"
          // style={{backgroundColor: "#54ae6a"}}
          >
            <Tab value={"one"} label="To do Task"/>
            <Tab value={"two"} label="WIP Task"/>
            <Tab value={"three"} label="Done Task"/>

        </Tabs>
      </Box>

      {displayTasks ? (
        <List sx={{ p: 0, height: 200, overflowY: 'auto', scrollbarWidth: 'thin',}}>
          {/* later try to change any type for task type */}
         {displayTasks.map((task: any, index: number)=>{
          const id = task["id"]
          let entityType: string = ""
          if(task["entity_type_name"] === 'Shot'){
            entityType = "shots"
          }
          else{
            entityType = "assets"
          }
          const pathname: string = `explorer/${task["project_id"]}/${entityType}/${task["entity_id"]}/tasks/${id}`
          return(
            <Paper key={id} sx={{ mb:1 }} >
              <ListItemButton sx={{display: "flex", justifyContent: "space-between"}}
               onClick={(event: React.MouseEvent<HTMLElement>)=>{
                // Prevent clicking when the menu is open
                if (!anchorEl && event.target !== actionMenuButton.current) {
                navigate(pathname);
                }
              }}>
                <div style={{display: "flex"}}>
                  <ColoredCircle 
                  color={task["task_type_color"]}
                  size ={20}
                  marginRight={15}
                  />
                  <Typography fontSize={14}>
                    {task["project_name"]}
                  </Typography>
                  <ArrowDelimiter/>
                  {entityType === "shots"&&(
                    <>
                      <Typography fontSize={14} color="text.disabled">
                        {task["sequence_name"]}
                      </Typography>
                      <ArrowDelimiter/>
                  </>
                  )}
                  <>
                    <Typography fontSize={14} color="text.disabled">
                      {task["entity_name"]}
                    </Typography>
                    <ArrowDelimiter/>
                    <Typography sx={{color: "rgb(231, 231, 231)",}}>
                      {task["task_type_name"]}
                    </Typography>
                    <ArrowDelimiter/>
                    <Typography color="text.disabled">
                      {task["name"]}
                    </Typography>
                  </>
                </div>
                <BarIcon taskId={id} index={index}></BarIcon>
              </ListItemButton>
            </Paper>
          )
         })} 
            
        </List>
      ) : (
        <Typography color="text.disabled">No recent tasks...</Typography>
      )}
    </div>
  );
};

export default AssignTaskList;
