import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  findAlbumById,
  followAlbum,
  getFeedAlbum,
  read,
  searchuser,
  unfollow,
  unfollowAlbum,
  giveAccessRights,
} from "../api/api-post";
import Posts from "./Posts";
import auth from "./../auth/auth-help";
import jwt1 from "jwt-decode";
import { useParams } from "react-router";
import { follow } from "../api/api-post";
import { toast } from "react-toastify";
// import dependency
import { checkFollow } from "../api/api-post";
import { getFeedUser } from "../api/api-post";
import { useNavigate, Link } from "react-router-dom";
import "./profile.css";
import logo from "../images/IMG-20201113-WA0051.jpg"; // with import
import NavBar from "./NavBar";
import AlbumPost from "./AlbumPost";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";

const AlbumProfile = () => {
  const [confirmAccess, setConfirmAccess] = useState(false);
  const [isnew, setnew] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const loading = searchResult.length != 0 && open;
  const params = useParams();
  console.log(params.id);
  const nav = useNavigate();

  const [value, SetValues] = useState({
    album: { followers: [], privilegedUsers: [] },
    following: false,
  });

  function Addone(data1) {
    setnew(true);
    console.log(data1);
    const updatedPosts = [...posts];
    updatedPosts.splice(0, 0, data1);
    setTimeout(function () {
      setPosts(updatedPosts);
    }, 500);
    setTimeout(function () {
      toast.success("Post Upload", {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1500,
      });
      setPosts(updatedPosts);
      nav("/");
    }, 700);
  }
  const jwt = auth.isAuthenticated();
  const user1 = jwt1(jwt.token);

  const checkIfUserHasAccessRights = () => {
    console.log(
      value.album.privilegedUsers,
      "==== inside album profile priviliged user====="
    );
    return value.album.privilegedUsers.some((user) => {
      return user._id === user1.id;
    });
  };

  const confirmAccessToUser = (event, value) => {
    const confirmed = window.confirm(
      "Are you sure you want to give access to this user?"
    );
    if (confirmed) {
      giveAccessRights(
        {
          t: jwt.token,
        },
        {
          userId: value._id,
          albumId: params.id,
        }
      )
        .then((res) => {
          toast.success("Access granted successfully!", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 1000,
          });
        })
        .catch((err) => {
          toast.error("SomeThing Wrong", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 1000,
          });
        });
      setConfirmAccess(true);
      console.log("========inside confirmed alert");
    } else {
      toast.error("Access granting process cancelled!", {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1000,
      });
    }
  };

  useEffect(() => {
    searchuser(
      {
        userId: user1.id,
      },
      {
        t: jwt.token,
      },
      {
        search: search,
      }
    ).then((data) => {
      if (search != "") setSearchResult(data);
      else setSearchResult([]);
    });
  }, [search]);

  useEffect(() => {
    findAlbumById({ albumId: params.id }, { t: jwt.token }).then((res) => {
      if (res.name) {
        let following = checkFollow(res, user1.id);
        SetValues({
          ...value,
          album: res,
          following: following,
        });
        loadPost(res._id);
      }
    });
  }, [params.id]);

  const updata = (post) => {
    console.log(post);

    let updated = [...posts];
    console.log(updated);

    updated = updated.filter(function (item) {
      return item._id !== post._id;
    });
    setTimeout(function () {
      toast.success("Post Deleted", {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1500,
      });
      setPosts(updated);
    }, 100);
  };

  const loadPost = (user) => {
    console.log("inside load post=======================");
    getFeedAlbum(
      {
        albumId: user,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      console.log(data, "======data in frontend");
      setPosts(data);
    });
  };
  const clickfollow = () => {
    let callApi = value.following == false ? followAlbum : unfollowAlbum;
    callApi({ userId: user1.id }, { t: jwt.token }, value.album._id).then(
      (data) => {
        if (data) {
          console.log(data);
          if (!value.following)
            toast.success(`following ${value.album.name}!`, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1000,
            });
          else {
            toast.warn(`unfollowing ${value.album.name}!`, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1000,
            });
          }
          SetValues({ ...value, following: !value.following });
        }
      }
    );
  };
  console.log(posts);
  console.log(
    "INside the profile================================================"
  );
  return (
    <div>
      <NavBar />
      <section className="  container mt-3  py-5 rounded px-5">
        <div className="d-flex mb-5 mt-4 ms-lg-5 ps-lg-5 ms-0 ps-0">
          <div className="me-md-5 me-3 ms-lg-5 ms-0">
            <img
              src={value.album.image}
              alt=""
              className="rounded-circle profile_img border border-light border-3"
            />
          </div>

          <div className=" w-50">
            <h3 className="mt-3 mb-4">{value.album.name}</h3>
            <div className="d-flex mb-3 mt-2 ">
              <div className="d-flex me-4">
                <p className="me-1">{posts.length}</p>
                <p>posts</p>
              </div>

              <div className="d-flex me-4">
                <p className="me-1">{value.album.followers.length}</p>
                <p>followers</p>
              </div>

              {checkIfUserHasAccessRights() && (
                <div className="mr-5 position-relative d-flex">
                  <Stack sx={{ width: 100 }}>
                    <Autocomplete
                      className="rounded"
                      size="small"
                      id="asynchronous-demo"
                      sx={{ width: 200 }}
                      options={searchResult}
                      loading={loading}
                      open={open}
                      onOpen={() => {
                        setOpen(true);
                      }}
                      onClose={() => {
                        setOpen(false);
                        //setSearchResult([])
                      }}
                      onChange={confirmAccessToUser} // prints the selected value
                      autoHighlight
                      getOptionLabel={(option) => option.name}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                          {...props}
                        >
                          <img
                            className="rounded-circle me-3"
                            loading="lazy"
                            width="30"
                            height="30"
                            src={option.image}
                            //srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                            alt=""
                          />
                          {option.name}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          className={"rounded bg-white"}
                          sx={{ p: "0px" }}
                          size="small"
                          onChange={(e) => setSearch(e.target.value)}
                          {...params}
                          placeholder="Search to give access"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Stack>
                </div>
              )}
            </div>

            {user1.id === params.id ? (
              <button
                onClick={() => {
                  nav("/user/edit/" + user1.id);
                }}
                type="button"
                className="btn btn-dark"
              >
                <i className="fa-solid fa-pen me-2" />
                Edit profile
              </button>
            ) : null}
            {user1.id != params.id ? (
              value.following === false ? (
                <button
                  onClick={clickfollow}
                  type="button"
                  className="ml-2 btn btn-success me-3"
                >
                  <i className="fa-solid fa fa-user-plus me-2"></i>
                  Follow
                </button>
              ) : (
                <button
                  onClick={clickfollow}
                  type="button"
                  className="ml-2 btn btn-danger me-3"
                >
                  <i className="fa-solid fa fa-user-plus me-2"></i>
                  Unfollow
                </button>
              )
            ) : null}
          </div>
        </div>
        {/* profile & cover img */}
        <section className="">
          <ul
            className="nav nav-pills mt-5 mt-lg-0 ms-lg-5 ms-0 "
            id="pills-tab"
            role="tablist"
          >
            <li
              className="nav-item ms-xl-5 ms-0 ps-lg-4 ps-0"
              role="presentation"
            >
              <button
                className="nav-link active ms-4"
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                posts
              </button>
            </li>
            <li className="nav-item " role="presentation">
              <button
                className="nav-link"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                followers
              </button>
            </li>
            <li className="nav-item " role="presentation">
              <button
                className="nav-link"
                id="pills-contact-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-albums"
                type="button"
                role="tab"
                aria-controls="pills-albums"
                aria-selected="false"
              >
                Privileged users
              </button>
            </li>
          </ul>
          <div className="tab-content p-4" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
              tabindex="0"
            >
              {checkIfUserHasAccessRights() && (
                <AlbumPost
                  albumId={params.id}
                  albumName={value.album.name}
                  onAdd={Addone}
                />
              )}

              <div className="left  col-lg-9 col-sm-12  col-sm-12  h-100  border_radius mt-4 m-auto">
                {posts.map((post) => {
                  return (
                    <Posts
                      updatePosts={updata}
                      post={post}
                      hasEditRights={checkIfUserHasAccessRights()}
                    />
                  );
                })}
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
              tabIndex={0}
            >
              <section className="d-flex justify-content-around mt-4">
                <div className="d-flex flex-column  col-5">
                  {value.album.followers.map((pers, idx) => {
                    return (
                      <>
                        <div
                          onClick={() => {
                            window.location.href = "/user/" + pers._id;
                          }}
                          className="d-flex align-items-center p-2  mb-3 rounded p-3 hover"
                        >
                          <div>
                            <img
                              src={pers.image}
                              alt="profile"
                              style={{ width: 50, height: 50 }}
                              className="me-3 rounded"
                            />
                          </div>
                          <h6 className=" fw-bold">{pers.name}</h6>
                          <i className="fa-solid fa-ellipsis ms-auto fs-4" />
                        </div>
                      </>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="pills-albums"
            role="tabpanel"
            aria-labelledby="pills-albums-tab"
            tabIndex={0}
          >
            <section className="d-flex justify-content-around mt-4">
              <div className="d-flex flex-column  col-5">
                {value.album.privilegedUsers.map((pers, idx) => {
                  return (
                    <>
                      <div
                        onClick={() => {
                          window.location.href = "/ablum/" + pers._id;
                        }}
                        className="d-flex align-items-center p-2  mb-3 rounded p-3 hover"
                      >
                        <div>
                          <img
                            src={pers.image}
                            alt="profile"
                            style={{ width: 50, height: 50 }}
                            className="me-3 rounded"
                          />
                        </div>
                        <h6 className=" fw-bold">{pers.name}</h6>
                        <i className="fa-solid fa-ellipsis ms-auto fs-4" />
                      </div>
                    </>
                  );
                })}
              </div>
            </section>
          </div>
        </section>
      </section>
    </div>
  );
};

export default AlbumProfile;
