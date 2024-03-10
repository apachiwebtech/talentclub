const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const sql = require('mysql');

const storage1 = multer.diskStorage({
  destination: '../public_html/upload/post_files/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const storage2 = multer.diskStorage({
  destination: '../public_html/upload/sharecard/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const storage3 = multer.diskStorage({
  destination: '../public_html/upload/profile/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const storage4 = multer.diskStorage({
  destination: '../public_html/upload/group_images/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const storage5 = multer.diskStorage({
  destination: '../public_html/upload/group_post_files/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage1 });
const upload2 = multer({ storage: storage2 });
const upload3 = multer({ storage: storage3 });
const upload4 = multer({ storage: storage4 });
const upload5 = multer({ storage: storage5 });

// app.use(express.static('file:///D:/React/Talentclub/Talentbackend/uploads'));


const cors = require('cors');
app.use(
  cors({
    origin: '*',
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.get('/', (req, res) => {
  return res.json('from the backend side');
});


const con = sql.createConnection({
  host: 'localhost',
  user: 'ttalent_club',
  password: 'CzPY3%(zPOmD',
  database: 'ttalent_club',
});


con.connect((err) => {
  if (err) {
    console.log('err');
  } else {
    console.log('success');
  }
});

app.listen(8081, () => {
  console.log('listening');
});


app.post('/posts', (req, res) => {
  let user_id = req.body.user_id;

  const sql = 'SELECT * FROM `posts` as po  LEFT JOIN post_files as pf on po.id = pf.post_id LEFT JOIN awt_register as ar on po.user_id = ar.id LEFT JOIN ( SELECT post_id as p_id, COUNT(*) AS like_count FROM `awt_post_likes` GROUP BY post_id ) AS like_counts ON po.id = like_counts.p_id WHERE po.user_id = ? AND po.deleted = 0 AND pf.post IS NOT NULL ORDER BY pf.post_id DESC';

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      const result = mergeDataWithSamePostId(data);
      return res.json(result);
    }
  });
});

app.post('/profile_data', (req, res) => {
  let user_id = req.body.user_id;

  const sql = "select * from awt_register where id = ? and deleted = 0"

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
})

app.post('/posts_search', (req, res) => {
  let search = req.body.newsearch.toLowerCase(); 

  let sql;

  if(search == ""){
     sql = 'SELECT * FROM `posts` LIMIT 0 ';  
  }else{
     sql = 'SELECT po.id,po.createdDate,po.title,po.description,pf.post_id,pf.post,ar.firstname,ar.lastname,ar.profile_image FROM `posts` as po  LEFT JOIN post_files as pf on po.id = pf.post_id LEFT JOIN awt_register as ar on ar.id = po.user_id WHERE   po.deleted = 0 AND pf.post IS NOT NULL ORDER BY pf.post_id DESC';
  }

  con.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      const result = mergeDataWithSamePostId(data);
      const filteredData = result.filter(item => (item.title.toLowerCase() + item.description.toLowerCase() ).includes(search));
      return res.json(filteredData);
      
      
    }
  });
});

app.post('/name_search', (req, res) => {
  let search = req.body.newsearch.toLowerCase(); 

  let sql;

  if(search == ""){
     sql = 'SELECT * FROM `posts` LIMIT 0 ';  
  }else{
     sql = 'select id, firstname , lastname , profile_image from `awt_register` where deleted = 0';
  }

  con.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      const filteredData = data.filter(item => ( item.firstname.toLowerCase() + item.lastname.toLowerCase()).includes(search));
      return res.json(filteredData);
      
      
    }
  });
});


app.get('/announcement', (req, res) => {

  const sql = 'SELECT * from awt_announcement where deleted = 0 and status = 1';

  con.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data)
    }
  });
});

app.post('/remove_post', (req, res) => {
  let user_id = req.body.user_id;
  let id = req.body.post_id;
  let date = new Date()

  const sql = 'update posts set deleted = 1 , updatedDate = ? where user_id =? and id =?';

  con.query(sql, [date, user_id, id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.use(express.urlencoded({ extended: false }));

app.post('/register', (req, res) => {
  let passWord = req.body.passWord;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let mobile = req.body.mobile;

  const sql = 'INSERT INTO awt_register (`firstname`,`lastname`,`email`,`mobile`,`password`) values(?, ?, ?, ?,?)';

  con.query(sql, [firstname, lastname, email, mobile, passWord], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  const sql = 'SELECT * FROM awt_register WHERE `email` = ? AND `password` =?';

  con.query(sql, [email, password], (err, data) => {
    if (err) {
      return res.json(err);
    }

    if (data.length === 1) {
      const email = data[0].email;
      const id = data[0].id;
      const userName = data[0].firstname;
      const lastName = data[0].lastname;
      const mobile = data[0].mobile;
      const profile_pic = data[0].profile_image;
      return res.json({ id: id, email: email, userName: userName, lastName : lastName, mobile: mobile, profile_pic: profile_pic });
    } else {
      return res.json("Email or Password dosen't match");
    }
  });
});

app.get('/awt_offers', (req, res) => {
  const sql = 'SELECT * FROM awt_offers ';

  con.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/post_disc', (req, res) => {
  let title = req.body.title;
  let description = req.body.discription;
  let user_id = req.body.user_id;
  let date = new Date()

  const sql = 'INSERT INTO posts(`title`, `description`, `user_id`,`createdDate`) VALUES (?, ?, ?,?)';

  con.query(sql, [title, description, user_id,date], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      const post_id = data.insertId;
      return res.json({ post_id: post_id });
    }
  });
});

app.post('/post_upload', upload.single('image'), (req, res) => {
  let imagepath = req.file.filename;
  let post_id = req.body.post_id;
  let date = new Date()

  const sql = 'INSERT INTO post_files(`post`,`post_id`,`createdDate`) VALUES(?,?,?)';

  con.query(sql, [imagepath, post_id, date], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      res.json(data);
    }
  });
});

app.post('/group_post_disc', (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let user_id = req.body.user_id;
  let group_id = req.body.group_id;
  
  const sql = 'INSERT INTO awt_group_posts(`title`, `description`, `user_id`,`group_id`) VALUES (?, ?, ?,?)';

  con.query(sql, [title, description, user_id,group_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      const post_id = data.insertId;
      return res.json({ post_id: post_id });
    }
  });
});

app.post('/group_post_upload', upload5.single('image'), (req, res) => {
  let imagepath = req.file.filename;
  let post_id = req.body.post_id;

  const sql = 'INSERT INTO awt_group_post_files(`post`,`post_id`) VALUES(?,?)';

  con.query(sql, [imagepath, post_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      res.json(data);
    }
  });
});

app.post('/change_pass', (req, res) => {
  let user_id = req.body.user_id;
  let password = req.body.password;

  const sql = 'UPDATE awt_register SET password = ? WHERE id = ?';

  con.query(sql, [password, user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/dash_post', (req, res) => {

  const post_id = req.body.post_id;

  let sql;
  let params

  if (post_id == undefined) {
    sql = 'SELECT * FROM `posts` as po  LEFT JOIN post_files as pf on po.id = pf.post_id LEFT JOIN awt_register as ar on po.user_id = ar.id LEFT JOIN ( SELECT post_id as p_id, COUNT(*) AS like_count FROM `awt_post_likes` GROUP BY post_id ) AS like_counts ON po.id = like_counts.p_id WHERE po.deleted = 0 AND pf.post IS NOT NULL ORDER BY pf.post_id DESC LIMIT 5 ';

  } else {
    sql = 'SELECT * FROM `posts` as po  LEFT JOIN post_files as pf on po.id = pf.post_id LEFT JOIN awt_register as ar on po.user_id = ar.id LEFT JOIN ( SELECT post_id as p_id, COUNT(*) AS like_count FROM `awt_post_likes` GROUP BY post_id ) AS like_counts ON po.id = like_counts.p_id WHERE po.deleted = 0 AND  pf.post IS NOT NULL AND po.id < ?  ORDER BY pf.post_id DESC LIMIT 5';
    params = [post_id]
  }

  con.query(sql, params, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      let lastPostId = null;
      if (data.length > 0) {
        lastPostId = data[data.length - 1].post_id;
      }
      const result = mergeDataWithSamePostId(data);
      return res.json({result , lastPostId});
  
    }
  });
});

function mergeDataWithSamePostId(data) {
  const mergedData = {};

  // Merge data with the same post_id
  data.forEach(item => {
    const postId = item.post_id;
    if (!mergedData[postId]) {
      mergedData[postId] = { ...item, post_images: [item.post] };
      delete mergedData[postId].post; // Remove the redundant key
    } else {
      mergedData[postId].post_images.push(item.post);
    }
  });

  // Reverse the order of the merged data
  const reversedData = Object.values(mergedData).reverse();

  return reversedData;
}

app.post('/post_like_user', (req, res) => {
  let post_id = req.body.post_id;

  const sql = 'SELECT firstname, lastname , profile_image FROM `awt_post_likes` as apl LEFT JOIN awt_register as ar on apl.user_id = ar.id WHERE apl.post_id = ?';

  con.query(sql, [post_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
})

app.post('/follo_post', (req, res) => {
  let user_id = req.body.user_id;
  let post_id = req.body.post_id;
  console.log(post_id, "popst");
  let sql;
  let params;

  if (post_id === undefined) {
    // If post_id is null, use a different query without the pf.post_id condition
    sql = 'SELECT af.*, po.*, ar.*, pf.*, like_counts.like_count FROM `awt_user_followers` as af LEFT JOIN `posts` as po ON af.follow_user_id = po.user_id LEFT JOIN `awt_register` as ar ON af.follow_user_id = ar.id LEFT JOIN `post_files` as pf ON po.id = pf.post_id LEFT JOIN (SELECT post_id, COUNT(*) AS like_count FROM `awt_post_likes` GROUP BY post_id) AS like_counts ON po.id = like_counts.post_id WHERE af.user_id = ? AND po.deleted = 0 and af.deleted = 0 AND  pf.post IS NOT NULL  GROUP BY pf.post_id ORDER BY pf.post_id DESC LIMIT 5;';
    params = [user_id];
  } 
  else if(post_id === null){
    sql = 'SELECT af.*, po.*, ar.*, pf.*, like_counts.like_count FROM `awt_user_followers` as af LEFT JOIN `posts` as po ON af.follow_user_id = po.user_id LEFT JOIN `awt_register` as ar ON af.follow_user_id = ar.id LEFT JOIN `post_files` as pf ON po.id = pf.post_id LEFT JOIN (SELECT post_id, COUNT(*) AS like_count FROM `awt_post_likes` GROUP BY post_id) AS like_counts ON po.id = like_counts.post_id WHERE af.user_id = ? AND po.deleted = 0 and af.deleted = 0 AND  pf.post IS NOT NULL  GROUP BY pf.post_id ORDER BY pf.post_id DESC LIMIT 0;';
    params = [user_id]
  }
  else {
    // Use the original query with the pf.post_id condition
    // sql = 'SELECT * FROM `awt_user_followers` as af LEFT JOIN `posts` as po ON af.follow_user_id = po.user_id LEFT JOIN `awt_register` as ar ON af.follow_user_id = ar.id LEFT JOIN `post_files` as pf ON po.id = pf.post_id LEFT JOIN ( SELECT post_id as p_id, COUNT(*) AS like_count FROM `awt_post_likes` GROUP BY post_id ) AS like_counts ON po.id = like_counts.p_id  WHERE af.user_id = ? AND po.deleted = 0 and af.deleted = 0 AND pf.post_id < ? ORDER BY pf.post_id DESC LIMIT 10';
    sql = 'SELECT af.*, po.*, ar.*, pf.*, like_counts.like_count FROM `awt_user_followers` as af LEFT JOIN `posts` as po ON af.follow_user_id = po.user_id LEFT JOIN `awt_register` as ar ON af.follow_user_id = ar.id LEFT JOIN `post_files` as pf ON po.id = pf.post_id LEFT JOIN (SELECT post_id, COUNT(*) AS like_count FROM `awt_post_likes` GROUP BY post_id) AS like_counts ON po.id = like_counts.post_id WHERE af.user_id = ? AND po.deleted = 0 and af.deleted = 0 AND  pf.post IS NOT NULL  GROUP BY pf.post_id < ? ORDER BY pf.post_id DESC LIMIT 5';
    params = [user_id, post_id];
  }

  con.query(sql, params, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      const result = data.map((row) => ({
        id: row.id,
        profile_image: row.profile_image,
        firstname: row.firstname,
        lastname: row.lastname,
        user_id: row.user_id,
        post: row.post,
        description: row.description,
        title: row.title,
        like_count: row.like_count,
        post_id: row.post_id,
      }));

      let lastPostId = null;
      if (data.length > 0) {
        lastPostId = data[data.length - 1].post_id;
      }
      
      return res.json({ result, lastPostId });

    }
  });
});

app.post('/post_count', (req, res) => {
  let user_id = req.body.user_id;

  const sql = "SELECT like_count ,pf.post_id FROM `awt_user_followers` as af LEFT JOIN `posts` as po ON af.follow_user_id = po.user_id LEFT JOIN `awt_register` as ar ON af.follow_user_id = ar.id LEFT JOIN `post_files` as pf ON po.id = pf.post_id LEFT JOIN (SELECT post_id, COUNT(*) AS like_count FROM `awt_post_likes` GROUP BY post_id) AS like_counts ON po.id = like_counts.post_id WHERE af.user_id = ? AND po.deleted = 0 and af.deleted = 0 GROUP BY pf.post_id ORDER BY pf.post_id DESC  "

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data)
    }
  })
});

app.post('/dash_post_count', (req, res) => {
  let user_id = req.body.user_id;

  const sql = "SELECT like_count ,pf.post_id FROM `posts` as po  LEFT JOIN post_files as pf on po.id = pf.post_id LEFT JOIN awt_register as ar on po.user_id = ar.id LEFT JOIN ( SELECT post_id as p_id, COUNT(*) AS like_count FROM `awt_post_likes` GROUP BY post_id ) AS like_counts ON po.id = like_counts.p_id WHERE po.deleted = 0 AND pf.post IS NOT NULL ORDER BY pf.post_id DESC "

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      const result = mergeDataWithSamePostId(data);
      return res.json(result);
    }
  })
});

app.post('/follow_user', (req, res) => {
  let user_id = req.body.user_id;
  let follow_user_id = req.body.follow_user_id;

  const sql = 'INSERT INTO awt_user_followers(`user_id`,`follow_user_id`) VALUES(?,?)';

  con.query(sql, [user_id, follow_user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/unfollow_user', (req, res) => {
  let user_id = req.body.user_id;
  let follow_user_id = req.body.follow_user_id;

  const sql = 'DELETE FROM awt_user_followers WHERE user_id = ? and follow_user_id = ?;';

  con.query(sql, [user_id, follow_user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/comment', (req, res) => {
  let post_id = req.body.post_id; // Use lowercase 'post_id'
  const sql = 'SELECT ac.id, comment, post_id , user_id,firstname,lastname, profile_image ,like_count FROM `awt_post_comment` as ac LEFT JOIN (SELECT comment_id, COUNT(*) AS like_count FROM `awt_post_comment_likes` GROUP BY comment_id) AS cl ON ac.id = cl.comment_id LEFT JOIN awt_register as ar ON ac.user_id = ar.id WHERE ac.post_id = ? and ac.deleted=0';

  con.query(sql, [post_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/add_comment', (req, res) => {
  let post_id = req.body.post_id;
  let comment = req.body.comment;
  let user_id = req.body.user_id;

  const sql = 'INSERT INTO awt_post_comment(`post_id`,`comment`,`user_id`) values(?,?,?)';

  con.query(sql, [post_id, comment, user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/add_group_comment', (req, res) => {
  let post_id = req.body.post_id;
  let comment = req.body.comment;
  let user_id = req.body.user_id;

  const sql = 'INSERT INTO awt_comment(`post_id`,`comment`,`user_id`) values(?,?,?)';

  con.query(sql, [post_id, comment, user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/comment_like_data', (req, res) => {
  let user_id = req.body.user_id;

  const sql = 'SELECT comment_id FROM `awt_post_comment_likes` WHERE user_id = ?';

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/group_comment_like_data', (req, res) => {
  let user_id = req.body.user_id;

  const sql = 'SELECT comment_id FROM `awt_grp_comment_likes` WHERE user_id = ?';

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/comment_like', (req, res) => {
  let comment_id = req.body.comment_id;
  let user_id = req.body.user_id;

  const sql = 'INSERT INTO awt_post_comment_likes(`comment_id`,`user_id`) values(?,?)';

  con.query(sql, [comment_id, user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/comment_like_delete', (req, res) => {
  let comment_id = req.body.comment_id;
  let user_id = req.body.user_id;

  const sql = 'DELETE FROM awt_post_comment_likes WHERE comment_id = ? and user_id = ?;';

  con.query(sql, [comment_id, user_id], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/group_comment_like', (req, res) => {
  let comment_id = req.body.comment_id;
  let user_id = req.body.user_id;

  const sql = 'INSERT INTO awt_grp_comment_likes(`comment_id`,`user_id`) values(?,?)';

  con.query(sql, [comment_id, user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/group_comment_like_delete', (req, res) => {
  let comment_id = req.body.comment_id;
  let user_id = req.body.user_id;

  const sql = 'DELETE FROM awt_grp_comment_likes WHERE comment_id = ? and user_id = ?;';

  con.query(sql, [comment_id, user_id], (err, data) => {
    if (err) {

      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/follow_data', (req, res) => {
  let user_id = req.body.user_id;

  const sql = 'SELECT follow_user_id FROM awt_user_followers WHERE user_id = ? and deleted = 0;';

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/add_bucket_list', (req, res) => {
  let user_id = req.body.user_id;
  let bucket_category = req.body.interested;
  let bucket_title = req.body.title;
  let is_done = req.body.selectedData;

  const sql = 'INSERT INTO awt_bucket_list(`user_id`,`bucket_category`,`bucket_title`,`is_done`) values(?,?,?,?)';

  con.query(sql, [user_id,bucket_category, bucket_title, is_done], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/post_like', (req, res) => {
  let post_id = req.body.post_id;
  let user_id = req.body.user_id;

  const sql = 'INSERT INTO awt_post_likes(`post_id`,`user_id`) values(?,?)';

  con.query(sql, [post_id, user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/post_like_data', (req, res) => {
  let user_id = req.body.user_id;

  const sql = 'SELECT post_id FROM `awt_post_likes` WHERE user_id = ?';

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/post_unlike', (req, res) => {
  let post_id = req.body.post_id;
  let user_id = req.body.user_id;

  const sql = 'DELETE FROM awt_post_likes WHERE post_id = ? and user_id = ?;';

  con.query(sql, [post_id, user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/dash_post_like', (req, res) => {
  let user_id = req.body.user_id;
  let post_id = req.body.post_id;

  const sql = 'SELECT * FROM awt_post_likes WHERE post_id = ? and user_id = ? and deleted = 0';

  con.query(sql, [post_id, user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
       if(data.length === 0){ 
        const sql = 'insert into awt_post_likes(`post_id` , `user_id`) values(?,?)';
        con.query(sql, [post_id, user_id], (err, data) => {
          if(err){
            return res.json(err);
          }
          else{
            console.log(data , "insert")
            return res.json(data);
          }
        })

       }
       else{
        const sql = 'DELETE FROM awt_post_likes WHERE post_id = ? AND user_id = ?';
        con.query(sql, [post_id, user_id], (err, data) => {
          if(err){
            return res.json(err);
          }
          else{
            console.log(data , "update")
            return res.json(data);
          }
        })
       }
    }
  });
});

app.get('/faq', (req, res) => {
  const sql = 'SELECT * FROM `awt_faq`';

  con.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/feedback', (req, res) => {
  let user_id = req.body.user_id;
  let subject = req.body.subject;
  let message = req.body.message;

  const sql = 'INSERT INTO awt_feedback(`user_id`,`subject`,`message`) VALUES(?,?,?)';

  con.query(sql, [user_id, subject, message], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/following', (req, res) => {
  let user_id = req.body.user_id;

  const sql = 'SELECT COUNT(*) as following FROM `awt_user_followers` WHERE user_id = ?';

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/follower', (req, res) => {
  let follow_user_id = req.body.user_id;

  const sql = 'SELECT COUNT(*) as follower FROM `awt_user_followers` WHERE follow_user_id = ?';

  con.query(sql, [follow_user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/posts_count', (req, res) => {
  let user_id = req.body.user_id;

  const sql = 'SELECT COUNT(*) as post FROM `posts` WHERE user_id = ?';

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/profile_pic', upload3.single('image'), (req, res) => {
  let imagepath = req.file.filename;
  let user_id = req.body.user_id;

  const sql = 'UPDATE awt_register SET profile_image = ? WHERE id = ?';

  con.query(sql, [imagepath, user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
   
      const sql = "select profile_image from awt_register where id  = ? and deleted = 0"
      con.query(sql, [user_id], (err, data) => {
        if (err) {
          console.log(err)
        } else {
          return res.json(data)
        }
      })
    }
  });
});

app.post('/user_details', (req, res) => {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let designation = req.body.designation;
  let city = req.body.location;
  let gender = req.body.gender;
  let birthyear = req.body.date;
  let id = req.body.user_id;

  const sql = 'UPDATE awt_register SET firstname = ? ,lastname = ? ,designation = ? , city = ? , gender = ? , birthyear = ? WHERE id = ?';

  con.query(sql, [firstname, lastname, designation, city, gender, birthyear, id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/user_detail_get', (req, res) => {
  let user_id = req.body.user_id;

  const sql = 'SELECT * FROM awt_register WHERE id = ? and deleted = 0';

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/group_name', (req, res) => {
  let user_id = req.body.user_id;

  const sql = 'SELECT * FROM awt_group WHERE user_id = ? and deleted = 0';

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/remove_group', (req, res) => {
  let user_id = req.body.user_id;
  let id = req.body.group_id;

  const sql = 'update awt_group set deleted = 1 WHERE id = ? AND user_id = ?';

  con.query(sql, [id, user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/group_like', (req, res) => {
  let user_id = req.body.user_id;
  let post_id = req.body.post_id;

  const sql = 'SELECT * FROM awt_grp_post_likes WHERE post_id = ? and user_id = ? and deleted = 0';

  con.query(sql, [post_id, user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
       if(data.length === 0){ 
        const sql = 'insert into awt_grp_post_likes(`post_id` , `user_id`) values(?,?)';
        con.query(sql, [post_id, user_id], (err, data) => {
          if(err){
            return res.json(err);
          }
          else{
            console.log(data , "insert")
            return res.json(data);
          }
        })

       }
       else{
        const sql = 'DELETE FROM awt_grp_post_likes WHERE post_id = ? AND user_id = ?';
        con.query(sql, [post_id, user_id], (err, data) => {
          if(err){
            return res.json(err);
          }
          else{
            console.log(data , "update")
            return res.json(data);
          }
        })
       }
    }
  });
});


app.post('/group_post_like_data', (req, res) => {
  let user_id = req.body.user_id;

  const sql = 'SELECT post_id FROM `awt_grp_post_likes` WHERE user_id = ?';

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/group_post_count', (req, res) => {
  let user_id = req.body.user_id;

  const sql = "SELECT like_count ,pf.post_id FROM `posts` as po  LEFT JOIN awt_group_post_files as pf on po.id = pf.post_id LEFT JOIN awt_register as ar on po.user_id = ar.id LEFT JOIN ( SELECT post_id as p_id, COUNT(*) AS like_count FROM `awt_grp_post_likes` GROUP BY post_id ) AS like_counts ON po.id = like_counts.p_id WHERE po.deleted = 0 AND pf.post IS NOT NULL ORDER BY pf.post_id DESC "

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      const result = mergeDataWithSamePostId(data);
      return res.json(result);
    }
  })
});

app.get('/group_all', (req, res) => {


  const sql = 'SELECT * FROM awt_group WHERE deleted = 0 ORDER BY id DESC ';

  con.query(sql , (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post('/follow_group', (req, res) => {
  let user_id = req.body.user_id;
  // console.log(user_id, "dhbd")
  const sql = "SELECT ajg.group_id,ag.title as name,ag.image,ag.keyword,agp.title,agp.description,agpf.post_id,agpf.post FROM `awt_joined_group` as ajg left JOIN awt_group as ag on ag.id = ajg.group_id LEFT JOIN awt_group_posts as agp on agp.group_id = ajg.group_id LEFT JOIN awt_group_post_files agpf on agp.id = agpf.post_id  WHERE ajg.user_id = ? and ajg.deleted = 0 and  agpf.post IS NOT NULL"


  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err)
    }
    else {
      // return res.json(data)
      const result = mergeDataWithSamePostId(data);
      return res.json(result)
    }
  });
});

app.post('/group_comment', (req, res) => {
  let post_id = req.body.post_id
const sql = "SELECT ac.id, comment, post_id, user_id , firstname,lastname, profile_image , like_count FROM `awt_comment` as ac LEFT JOIN (SELECT comment_id, COUNT(*) AS like_count FROM `awt_grp_comment_likes` GROUP BY comment_id) AS cl ON ac.id = cl.comment_id LEFT JOIN awt_register as ar ON ac.user_id = ar.id  WHERE ac.post_id = ? and ac.deleted = 0";

  con.query(sql, [post_id], (err, data) => {
    if (err) {
      return res.json(err)
    }
    else {
      return res.json(data)
    }
  })
});

app.post('/delete_group_comment', (req, res) => {
  let comment_id = req.body.comment_id
  const sql = "update awt_comment set deleted = 1 where id = ?";
  
    con.query(sql, [comment_id], (err, data) => {
      if (err) {
        return res.json(err)
      }
      else {
        return res.json(data)
      }
    })
  });
  app.post('/delete_user_comment', (req, res) => {
    let comment_id = req.body.comment_id
    const sql = "update awt_post_comment set deleted = 1 where id = ?";
    
      con.query(sql, [comment_id], (err, data) => {
        if (err) {
          return res.json(err)
        }
        else {
          return res.json(data)
        }
      })
    });

app.post('/join_group', (req, res) => {
  let user_id = req.body.user_id;
  let group_id = req.body.group_id;
  const sql = "insert into awt_joined_group(`user_id`,`group_id`) values(?,?)";

  con.query(sql, [user_id,group_id], (err, data) => {
    if (err) {
      return res.json(err)
    }
    else {
      return res.json(data)
    }
  })
});

app.post('/group_joindata', (req, res) => {
  let user_id = req.body.user_id;
  // let group_id = req.body.group_id;
  const sql = "select group_id from awt_joined_group where user_id = ?";

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err)
    }
    else {
      return res.json(data)
    }
  })
});

app.post('/create_group', upload4.single('image'), (req, res) => {
  let imagepath = req.file.filename;
  let user_id = req.body.user_id;
  let title = req.body.title;
  let keyword = req.body.keyword;

  const sql = 'INSERT INTO awt_group (`user_id`,`image`,`title`,`keyword`) VALUES(?,?,?,?)';

  con.query(sql, [user_id, imagepath, title, keyword], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.get('/group_posts', (req, res) => {

  const sql = 'SELECT ag.id,ag.title,ag.image,agp.title as post_title,agp.description,agpf.post_id,agpf.post,agpf.createdDate FROM `awt_group` as ag LEFT JOIN awt_group_posts as agp ON ag.id = agp.group_id LEFT JOIN awt_group_post_files as agpf ON agp.id = agpf.post_id';

  con.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.get('/getQuestions/:catId', (req, res, next) => {
  const catId = req.params.catId;
  const sql = "SELECT id, question, cat_id FROM awt_assess_question WHERE cat_id = ?";

  con.query(sql, [catId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  })
})
app.get('/getQuestions/:catId/:subId', (req, res, next) => {
  const catId = req.params.catId;
  const subId = req.params.subId;
  const sql = "SELECT * FROM awt_assess_question as aq left join awt_assess_q_answer as aqa on aq.id = aqa.question_id WHERE aq.cat_id = ? AND aq.cid = ?";

  con.query(sql, [catId, subId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      const mergedData = mergeData(data);
      console.log(mergedData)

      return res.json(mergedData);
    }
  })
})

// function mergeData(data) {
//   const mergedData = {};
//   data.forEach(item => {
//     const postId = item.question_id;
//     if (!mergedData[postId]) {
//       mergedData[postId] = { ...item, Options: [item.option_value], };
//       delete mergedData[postId].option_value; // Remove the redundant key
//     } else {
//       mergedData[postId].Options.push(item.option_value)
//     }
//   });

//   return Object.values(mergedData);
// }
function mergeData(data) {
  const mergedData = {};

  data.forEach(item => {
    const postId = item.question_id;
    const { option_value, points } = item;

    if (!mergedData[postId]) {
      mergedData[postId] = { ...item, Options: [{ option_value, points }] };
      delete mergedData[postId].option_value; // Remove the redundant key
      delete mergedData[postId].points; // Remove the redundant key
    } else {
      mergedData[postId].Options.push({ option_value, points });
    }
  });

  return Object.values(mergedData);
}


app.get('/getList/:cat_id', (req, res, next) => {
  const cat_id = req.params.cat_id;

  const sql = 'SELECT DISTINCT aq.cid, aa.cat_id, aa.title, aa.image, aa.description FROM awt_assessement aa LEFT JOIN awt_assess_question aq ON aa.cat_id = aq.cat_id WHERE aa.cat_id = ?';
  // const sql2 = 'SELECT DISTINCT aa.id, aa.cat_id, aa.title, aa.image, aa.description, aq.cid AS assess_question_cid FROM awt_assessement aa LEFT JOIN awt_assess_question aq ON aa.cat_id = aq.cat_id WHERE aa.cat_id = ?';

  const sql3 = `
  WITH CTE AS (
    SELECT 
      ROW_NUMBER() OVER (PARTITION BY aa.title, aa.description, aa.image ORDER BY aq.cid) AS cid,
      aa.cat_id,
      aa.title,
      aa.image,
      aa.description
    FROM 
      awt_assessement aa
    LEFT JOIN 
      awt_assess_question aq ON aa.cat_id = aq.cat_id
    WHERE 
      aa.cat_id = ?
  )
  SELECT 
    cid,
    cat_id,
    title,
    image,
    description
  FROM 
    CTE
  ORDER BY 
    cid
  
`
  con.query(sql, [cat_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      // const uniqueCIDData = filterUniqueCID(data); // Filtering unique cid values
      //       console.log(uniqueCIDData);
      return res.json(data);

    }
  })
})


// function filterUniqueCID(data) {
//   const titleMap = {
//       1: 'Academic',
//       2: 'Individual Contributions',
//       3: 'Leadership',
//       4: 'Life Skills',
//       5 : 'Performing Art Skills',
//       6 : 'Social Skills',
//       7 : 'Sport Skills' // Add more mappings as needed
//       // Add more mappings for other cids
//   };

//   const imageMap = {
//       1: 'Icon_01.png',
//       2: 'Icon_03.png',
//       3: 'Icon_02.png',
//       4: 'Icon_04.png',
//       5: 'Icon_05.png',
//       6: 'Icon_06.png',
//       7: 'Icon_07.png',

//       // Add more mappings as needed
//       // Add more mappings for other cids
//   };

//   const descriptionMap = {
//       1: 'Content about academic',
//       2: '', // Add descriptions for respective cids
//       3: 'Leadership details',
//       // Add more descriptions for other cids
//   };

//   const filteredData = [];

//   data.forEach(item => {
//       const newItem = { ...item };
//       newItem.title = titleMap[item.cid] || item.title;
//       newItem.image = imageMap[item.cid] || item.image;
//       newItem.description = descriptionMap[item.cid] || item.description;
//       filteredData.push(newItem);
//   });

//   const uniqueData = filteredData.filter((item, index) => {
//       return (
//           filteredData.findIndex(
//               innerItem =>
//                   innerItem.cid === item.cid &&
//                   innerItem.title === item.title &&
//                   innerItem.image === item.image &&
//                   innerItem.description === item.description
//           ) === index
//       );
//   });function mergeData

//   return uniqueData;
// }

function mergeDatas(data) {
  const mergedData = {};
  data.forEach(item => {
    const catId = item.cat_id;
    if (!mergedData[catId]) {
      mergedData[catId] = { ...item, Points: [item.points] };
      delete mergedData[catId].points; // Remove t  he redundant key
    } else {
      mergedData[catId].Points.push(item.points);
    }
  });

  return Object.values(mergedData);
}


app.post('/postQuestionData', (req, res, next) => {
  const user_id = req.body.user_id;
  const question_type = req.body.question_type;
  const qid = req.body.qid;
  const points = req.body.points;
  const answer = req.body.answerId;
  const cid = req.body.cid;
  const cat_id = req.body.cat_id;
  // const sql = 'INSERT INTO awt_register (`firstname`,`lastname`,`email`,`mobile`,`password`) values(?, ?, ?, ?,?)';


  const checkIfAnswerExists = 'SELECT DISTINCT catid,scatid,qid,answer,question_type,points,user_id FROM `awt_answer_submit` WHERE qid = 4 and user_id = 680;';

  
  con.query(checkIfAnswerExists, [qid,user_id], (checkError, checkData)=>{
    if(checkError){
      return res.json("cannot check if answer exists")
    }else{
      if(checkData.length > 0){
        const updateQuery = 'UPDATE awt_answer_submit SET answer = ?, question_type = ?, points = ? WHERE user_id = ? AND qid = ?';

        con.query(updateQuery, [answer, question_type, points, user_id, qid], (updateError, updateData)=>{
          if(updateError){
            return res.json({message : "Cannot update the record."});
          }else{
            return res.json({message : "Answer updated successfully."});
          }
        })
      }else{
        const sql = 'INSERT INTO awt_answer_submit (`qid`, `answer`, `question_type`, `points`, `user_id`, `catid`, `scatid`) values(?,?,?,?,?,?,?)';

        con.query(sql, [qid, answer, question_type, points, user_id, cat_id, cid], (err, data) => {
          if (err) {
            return res.json({message : "Answer Couldn't not be saved."});
          } else {
            return res.json({message : "Answer saved successfully."});
          }
        });
      }
    }
  })

})

//get data based on cat_id and userId

// app.post('/marks', (req, res, next) => {

//   const user_id = req.body.user_id;
//   const catid = [5, 6, 7];
//   const sql = 'SELECT * FROM awt_answer_submit WHERE user_id = ? AND catid IN (?)';
//   console.log(user_id)
//   con.query(sql, [user_id, catid], (err, data) => {
//     if (err) {
//       return res.json(err);
//     } else {
//       const mergedData = mergeDatas(data); // Using the mergeDatas function

//       const finalResponse = {
//         Data: mergedData
//       };

//       return res.json(finalResponse);
//     }
//   });
// })

app.post('/marksnew', (req, res, next) => {

  const user_id = req.body.user_id;
  console.log(user_id);
  // const sql = 'SELECT * FROM awt_answer_submit WHERE user_id = ? AND catid IN (?)';

  const sql = 'SELECT s.*, q.cat_id FROM awt_answer_submit as s LEFT JOIN awt_assess_question as q on q.id = s.qid WHERE s.user_id= ?;'
    con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      const mergedData = mergeDatas(data); // Using the mergeDatas function

      const finalResponse = {
        Data: mergedData
      };

      return res.json(finalResponse);
    }
  });
})

// app.post('/marksnew', (req, res, next) => {

//   const user_id = req.body.user_id;
//   console.log(user_id);
//   // const sql = 'SELECT * FROM awt_answer_submit WHERE user_id = ? AND catid IN (?)';

//   const sql = 'SELECT s.*, q.cid, q.cat_id FROM awt_answer_submit as s LEFT JOIN awt_assess_question as q on q.id = s.qid AND s.user_id = ?'
//   const sql2 = 'SELECT s.*, q.cid, q.cat_id FROM awt_answer_submit as s LEFT JOIN awt_assess_question as q on q.id = s.qid WHERE s.user_id = 1'
//   const sql4 = 'SELECT s.*, q.cid, q.cat_id FROM awt_answer_submit as s LEFT JOIN awt_assess_question as q on q.id = s.qid WHERE s.user_id= ?'
//     con.query(sql4, [user_id], (err, data) => {
//     if (err) {
//       return res.json(err);
//     } else {
//       const mergedData = mergeDatas(data); // Using the mergeDatas function

//       const finalResponse = {
//         Data: mergedData
//       };

//       return res.json(finalResponse);
//     }
//   });
// })
// app.get('/marksTest', (req,res, next)=>{
//   const sql = 'SELECT s.*, q.cid, q.cat_id FROM awt_answer_submit as s LEFT JOIN awt_assess_question as q on q.id = s.qid WHERE s.user_id= 4'
//   const sql2 = 'SELECT s.*, q.cat_id FROM awt_answer_submit as s LEFT JOIN awt_assess_question as q on q.id = s.qid WHERE s.user_id= 4 AND q.cat_id = 6;'

//   con.query(sql2, (err, data)=>{
//     if(err){
//       res.json(err);
//     }else{
//       const mergedData = mergeDatas(data); // Using the mergeDatas function

//       const finalResponse = {
//         Data: mergedData
//       };

//       return res.json(finalResponse);    }
//   })
// })
app.post('/sharecard', upload2.single('image'), (req, res) => {
  let imagepath = req.file.filename;
  let user_id = req.body.user_id;
  let tempid = req.body.tempid;

  const sql = "INSERT INTO sharecard(`tempid`,`finalcard`,`userid`)VALUES(?,?,?)";

  con.query(sql, [tempid, imagepath, user_id], (err, data) => {
    if (err) {
      return res.json(err);
    }
    else {
      return res.json(data);
    }
  })
});

app.post('/sharedetail', (req, res) => {
  let shareid = req.body.shareid;

  const sql = "SELECT finalcard FROM sharecard WHERE id = ? AND DELETED = 0";

  con.query(sql, [shareid], (err, data) => {
    if (err) {
      return res.json(err);
    }
    else {
      return res.json(data);
    }
  })
});

app.post('/to_do', (req, res) => {
  let user_id = req.body.user_id

  const sql = "SELECT * from awt_bucket_list WHERE user_id = ? AND deleted = 0 AND is_done ='to_do' ";

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err);
    }
    else {
      return res.json(data);
    }
  })
});


app.post('/done_list', (req, res) => {
  let user_id = req.body.user_id

  const sql = "SELECT * from awt_bucket_list WHERE user_id = ? AND deleted = 0 AND is_done ='done' ";

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err);
    }
    else {
      return res.json(data);
    }
  })
});

app.post('/done', (req, res) => {
  let bucket_id = req.body.bucket_id;
  let done = req.body.done;

  const sql = "UPDATE awt_bucket_list SET is_done = ? WHERE id = ?";

  con.query(sql, [done, bucket_id], (err, data) => {
    if (err) {
      return res.json(err);
    }
    else {
      return res.json(data);
    }
  })
});

app.post('/updateDashboardScore', (req, res) => {
  const user_id = req.body.user_id;
    // const user_id = 4;
    console.log(req.body)
    console.log(user_id)
    const sql_query = `SELECT id, title, color FROM awt_category_assessment WHERE deleted = 0`;
    con.query(sql_query, (err, result) => {
      if (err) throw err;

      let cat1 = 0;
      let cat2 = 0;
      let cat3 = 0;
      let totalQuestions = 0;
      let totalScore = 0;

      result.forEach((row, index) => {
        const catid = row.id;
        const scoreQuery = `
          SELECT SUM(points) AS score, COUNT(s.id) AS question, 
          (SELECT COUNT(id) FROM awt_assess_question) AS qcount 
          FROM awt_answer_submit AS s 
          LEFT JOIN awt_assess_question AS q ON q.id = s.qid 
          LEFT JOIN awt_assessement AS a ON a.id = q.cid 
          WHERE a.cat_id = ? AND s.user_id = ? AND s.deleted = 0
        `;

        con.query(scoreQuery, [catid, user_id], (err, scoreResult) => {
          if (err) throw err;

          const { score, question, qcount } = scoreResult[0];
          const qtotal = question * 5;
          const qperc = (score / qtotal) * 100;

          if (index === 0) {
            cat1 = qperc > 95 ? 95 : qperc;
            totalQuestions += question;
          } else if (index === 1) {
            cat2 = qperc > 95 ? 95 : qperc;
            totalQuestions += question;
          } else if (index === 2) {
            cat3 = qperc > 95 ? 95 : qperc;
            totalQuestions += question;
          }

          totalScore += score;

          if (index === result.length - 1) {
            const total_average = (totalScore / (totalQuestions * 5)) * 100 / 3;
            const sscore = (cat1 * 50 / 100) + (cat2 * 20 / 100) + (cat3 * 30 / 100);
            const anscount = cat1 + cat2 + cat3;

            if (qcount <= anscount) {
              res.json({
                success: true,
                cat1: Math.round(cat1),
                cat2: Math.round(cat2),
                cat3: Math.round(cat3),
                total_average: Math.round(total_average),
                sscore: anscount,
                averageScore : Math.round(sscore),
                tquestion: totalQuestions
              });
            } else {
              res.json({ success: false });
            }
          }
        });
      });
    });
  
});
