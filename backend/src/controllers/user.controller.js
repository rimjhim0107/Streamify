import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js"

export async function getRecommendedUsers(req,res){
    try{
        const currentUserId = req.user.id;
        const currentUser = req.user;
        const recommendedUsers = await User.find({
            $and: [
               {_id : {$ne: currentUserId}},   //exclude the user in recommendations
               {_id: {$nin : currentUser.friends}},    //exclude users friends in recommendations
               {isOnboarded : true}
            ]
        });
        res.status(200).json(recommendedUsers);
    }
    catch(err){
        console.error("Error in Recommendations controllers : ", err);
        res.status(500).json({ message : "Internal Server Error" });
    }
}

export async function getMyFriends(req , res){
    try{
        const user = await User.findById(req.user.id).select("friends").populate("friends" , "fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(user.friends);
    }
    catch(err){
        console.error("Error in getMyFriends controller : ",err);
        res.status(500).json({ message : "Internal Server Error"});
    }
}

export async function sendFriendRequest(req, res){
    try{
        const myId = req.user.id;
        const { id: recipientId } = req.params;

        //prevent sending req to ourselves
        if(myId === recipientId) return res.status(400).json( { message : "You can't send friend request to yourself"});

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(400).json({ message : "Recipient not found"});
        }
        
        //check if user is already friend
        if(recipient.friends.includes(myId)){
            return res.status(400).json({ message : "You are already friends with this user"});
        }
        
        //check if a request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId , recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ],
        });

        if(existingRequest){
            return res.status(400).json({ message : "A friend request already exists between you and this user"});
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });
        
        res.status(201).json(friendRequest);
    }
    catch(err){
        console.error("Error in sendFriendRequest controller : ",err.message);
        res.status(500).json({ message : "Internal Server Error"});
    }
}

export async function acceptFriendRequest(req, res){
    try{
        const { id: requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({ message : "Friend Request not found"});
        }
        
        //verify if the current user is the recipient
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({ message : "You are not authorized to accept this request"});
        }
        
        friendRequest.status = "accepted";
        await friendRequest.save();

        //add each user to the other's friends array
        //addToSet adds an element in the array only if they do not already exist
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet: { friends: friendRequest.recipient},
        });

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet: { friends: friendRequest.sender},
        });

        res.status(200).json({ message: "Friend Request accepted"});
    }
    catch(err){
        console.error("Error in acceptFriendRequest controller : ",err.message);
        res.status(500).json({ message : "Internal Server Error"});
    }
}

export async function getFriendRequests(req, res){
     try{
        const incomingReqs = await FriendRequest.find({
            recipient : req.user.id,
            status : "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await friendRequest.find({
            sender: req.user.id,
            status : "accepted"
        }).populate("recipient", "fullName profilePic");

        res.status(200).json({ incomingReqs, acceptedReqs});
     }
     catch(err){
        console.log("Error in getPendingFriendRequests comtroller: ",err.message);
        res.satus(500).json({ message : "Internal Server Error"});
     }
}

export async function getOutgoingFriendReqs(req, res){
    try{
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(outgoingRequests);
    }
    catch(err){
        console.log("Error in getOutgoingFriendReqs controller : ",err.message);
        res.status(500).json({ message : "Internal Server Error"});
    }
}