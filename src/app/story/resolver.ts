import { GraphqlContext } from "../../services/interfaces";
import StoryService from "../../services/storyService";
import {  CreateStoryPayload } from "./types";

const queries={
  getAllStories:async()=>{ 
    return await StoryService.getAllStories();
  },
}
const mutations={
  createStory:async (parent:any,{payload}:{payload:CreateStoryPayload},ctx:GraphqlContext)=>{
    return await StoryService.createStory(payload,ctx);
  },
 };
const StoryResolver={
  Story:{
    author:async (parent:any)=>{
      return await StoryService.getAuthor(parent);
    },
    likes:async (parent:any)=>{
      return await StoryService.getLikes(parent);
    }
  }
}
export const resolvers={mutations,queries,StoryResolver};