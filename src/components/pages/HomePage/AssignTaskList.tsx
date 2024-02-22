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

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) =>{
    setTabValue(newValue);
  };

  const handleclick =() =>{
    setSomethingChange(!somethingChange)
  }

  const handleActionMenuClose = () => {
    setAnchorEl(null);
    setMouseOver(false);
  };
  
  const handleActionMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    // Stop propagation of onClick event because buttons are overlaping
    event.stopPropagation();
    
  };

  // const actionMenuIcon = () => {
  //   const button = (
  //     <IconButton
  //       sx={{ ml: 1, position: "absolute", top: 0, right: 0 }}
  //       onClick={handleActionMenuClick}
  //       ref={actionMenuButton}
  //     >
  //       <InfoIcon color="disabled" fontSize={"small"} />
  //     </IconButton>
  //   );
  // };
  const {user} = useAuth();
  const[assignTasks, setAssignTasks] = useState<Task[]>([])


  useEffect(()=>{
    switch(tabValue){
      case "one":
        getUserTaskAssign(user?.id as string).then((response) =>{
          setAssignTasks(response.data.filter(taskStatus=>{
            return taskStatus.task_status_name === "Todo" 
          }))
        })
        break;
      case "two":
        getUserTaskAssign(user?.id as string).then ((response) =>{
          setAssignTasks(response.data.filter(taskStatus =>{
            return taskStatus.task_status_name === "Work In Progress"
          }))
        })
        break;
      case "three":
        getUserDoneTaskAssign(user?.id as string).then((response)=>{
          setAssignTasks(response.data)
        })
        break;
      default:
        return undefined;
    }
    
  }, [tabValue, somethingChange])

  useEffect(()=>{
    getTaskStatus().then((response)=> {
      setTaskStatus(response.data)

    })
    
  },[])

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

  function TodoButton({taskId}: {taskId:string}){
    return (
      <Tooltip title="change status to TO DO">
        <IconButton onClick={(event: React.MouseEvent<HTMLElement>) =>{
          handleActionMenuClick(event)
          updateSatusOfTask(taskId, todoStatus[0]["id"])
          handleclick()
        }}>
          <PendingIcon color="disabled" fontSize="small"></PendingIcon>
        </IconButton>
      </Tooltip>
    )
  }
  function WipButton({taskId}: {taskId:string}){
    return (
      <Tooltip title="change status to WIP">
        <IconButton onClick={(event: React.MouseEvent<HTMLElement>) =>{
          handleActionMenuClick(event)
          updateSatusOfTask(taskId, wipStatus[0]["id"])
          handleclick()
        }}>
          <Construction color="disabled" fontSize="small"></Construction>
        </IconButton>
      </Tooltip>
    )
  }
  function DoneButton({taskId}: {taskId:string}){
    return (
      <Tooltip title="change status to DONE">
        <IconButton onClick={(event: React.MouseEvent<HTMLElement>)=>{
          handleActionMenuClick(event)
          updateSatusOfTask(taskId, doneStatus[0]["id"])
          handleclick()
        }}>
          <DoneIcon color="disabled" fontSize="small"></DoneIcon>
        </IconButton>
      </Tooltip>
    )
  }

  function BarIcon({taskId}:{taskId:string}) {
    switch(tabValue){
      case "one":
        return(
          <div>
            <WipButton taskId={taskId}/>
            <DoneButton taskId={taskId}/>
          </div>
        )
        break;
      case "two":
        return(
          <div>
            <TodoButton taskId={taskId}/>
            <DoneButton taskId={taskId}/>
          </div>
        )
        break;
      case "three":
        return(
          <div>
            <TodoButton taskId={taskId}/>
            <WipButton taskId={taskId}/>
          </div>
        )
        break;
      default:
        return null; 
    }
  }
  // function ItemMenu({taskId}: {taskId:string}) {
  //   console.log(`ItemMenu: ${taskId}`)
  //   switch(tabValue){
  //     case "one":
  //       return(
  //         <MenuItem onClick={()=>{
  //           updateSatusOfTask(taskId, doneStatus[0]["id"])
  //           handleclick()
  //         }}
  //         >
  //           <ListItemIcon>
  //             <DoneIcon/>
  //           </ListItemIcon>
  //           Task Done
  //         </MenuItem>
  //       )
  //       break;
  //     case "two":
  //       return(
  //         <MenuItem onClick={()=>{
  //           updateSatusOfTask(taskId, todoStatus[0]["id"])
  //           handleclick()
  //         }}>
  //           <ListItemIcon>
  //             <Construction/>
  //           </ListItemIcon>
  //           Task Todo
  //         </MenuItem>
  //       )
  //       break;
  //     default:
  //       return null; 
  //   }
  // }

  const navigate = useNavigate();

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

      {assignTasks ? (
        <List sx={{ p: 0, height: 200, overflowY: 'auto', scrollbarWidth: 'thin',}}>
          {/* later try to change any type for task type */}
         {assignTasks.map((task: any)=>{
         const id = task["id"]
         console.log(`id ${id}`)
          let entityType: string = ""
          if(task["entity_type_name"] === 'Shot'){
            entityType = "shots"
          }
          if(task["entity_type_name"] === 'Asset'){
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
              {/* <ListItemButton sx={{display: "flex", justifyContent: "space-between"}}
               onClick={() =>{
                console.log(`buttonId:${id}`)
               }
              }> */}
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
                    
                      <Typography fontSize={14} color="text.disabled">
                        {task["entity_name"]}
                      </Typography>
                      <ArrowDelimiter/>
                  </>
                  )}
                  <>
                    <Typography sx={{color: "rgb(231, 231, 231)",}}>
                      {task["task_type_name"]}
                    </Typography>
                    <ArrowDelimiter/>
                    <Typography color="text.disabled">
                      {task["name"]}
                    </Typography>
                  </>
                </div>
                <BarIcon taskId={id}></BarIcon>
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
