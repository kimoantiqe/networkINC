const User                    = require('./../models/user');
const Task                    = require('./../models/task');
const { to, ReE, ReS }        = require('../services/util');



// let SanatizeUpdateData = function(data){
// 	let blacklist = ['membership','role','createdAt','updatedAt','_id','__v'] ;
//
// 	for(let i=0 ; i <blacklist.length ; i++){
// 		if(data[blacklist[i]]){
// 			return true;
// 		}
// 	}
// 	return false;
//
// };

const create = async function(req, res,next){
	res.setHeader('Content-Type', 'application/json');

	const taskSchema = ['taskInfo', 'taskType' , 'taskTitle','taskDueDate'];

	const body = req.body;
	const user = req.user;

	for(let i =0 ;  i< taskSchema.length ; i++){
		if(!body[taskSchema[i]]) return ReE(res, 'Please enter '+taskSchema[i]+' to create task');
	}

		let err, task;
    //The following must only be handeled in the update function invoked by the put request
    delete body.subscribedUsers;

		//Add to user as owner
		body['taskOwner'] = user._id;

    [err, task] = await to(Task.create(body));
    if(err){return ReE(res, err, 422);}

		//Add req to body
		req.taskCreated = task;
		next();
};
module.exports.create = create;

const get = async function(req, res){
	res.setHeader('Content-Type', 'application/json');
	let user = req.user;
	let err, userTasks;
	[err, userTasks] = await to(User.findById(user._id).select('tasks').populate('tasks'));
	if(err){return ReE(res, err, 422);}
	return ReS(res, {tasks:userTasks.tasks});
};
module.exports.get = get;

// const update = async function(req, res){
// 	let err, user, data ;
// 	user = req.user;
// 	data = req.body;
//
// 	if(SanatizeUpdateData(data)) {
// 		return ReE(res,"You can't do that",403);
// 	}
//
//   user.set(data);
//
//
//   [err, user] = await to(user.save());
//   if(err){
// 	console.log(err, user);
//
// 	if(err.message.includes('E11000')){
// 		if(err.message.includes('email')){
// 			err = 'This email address is already in use';
// 		}else{
// 			err = 'Duplicate Key Entry';
// 		}
// 	}
//
// 	return ReE(res, err);
//   }
//   return ReS(res, {message :'Updated User: '+user.email});
// };
//
// module.exports.update = update;
//
//
// const getuser = async function(req, res){
//
// 	res.setHeader('Content-Type', 'application/json');
// 	let user = req.user;
// 	let err;
// 	let otheruser;
// 	let id = req.query.id;
// 	console.log(id);
// 	User.findById(id, function(err, newuser) {
// 		if(newuser.matches.map((newuser) => newuser.toString()).includes(user._id.toString())){
// 			otheruser = newuser;
// 			return ReS(res, {user:newuser.toWeb()});
// 		}
// 		else{
// 			return ReE(res, "user not in your matches");
// 		}
// 	});
// };
//
// module.exports.getuser = getuser;
//
//
// const remove = async function(req, res){
// 	let user, err;
// 	user = req.user;
//
// 	[err, user] = await to(user.remove());
// 	if(err) {
// 		return ReE(res, 'error occured trying to delete user');
// 	}
//
// 	return ReS(res, {message:'Deleted User'}, 204);
// };
// module.exports.remove = remove;
//