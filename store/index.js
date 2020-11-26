import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      addPost(state, post) {
        state.loadedPosts.push(post);
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(
          post => post.id === editedPost.id
        );
        state.loadedPosts[postIndex] = editedPost;
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        console.log("nuxtServerInit:start");
        console.log("nuxtServerInit context:" + context.app.$axios);
        context.app.$axios.$get("http://www.yahoo.com").then(data => {
          console.log("nuxtServerInit context:" + data.slice(0, 100));
        });
        //return this.$axios
        //  .$get("https://nuxtsteroids.firebaseio.com/posts.json")
        return context.app.$axios
          .$get("https://nuxtsteroids.firebaseio.com/posts.json")
          .then(data => {
            const postsArray = [];
            console.log("nuxtServerInit.1:" + data);

            for (const key in data) {
              console.log("nuxtServerInit.1:" + key + "," + data[key]);
              postsArray.push({ ...data[key], id: key });
            }
            vuexContext.commit("setPosts", postsArray);
          })
          .catch(e => {
            console.log("nuxtServerInit.2:" + e.toString());
            context.error(e);
          });
      },
      addPost(vuexContext, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        };
        return this.$axios
          .$post("https://nuxtsteroids.firebaseio.com/posts.json", createdPost)
          .then(data => {
            vuexContext.commit("addPost", { ...createdPost, id: data.name });
          })
          .catch(e => console.log(e));
      },
      editPost(vuexContext, editedPost) {
        return this.$axios
          .$put(
            "https://nuxtsteroids.firebaseio.com/posts/" +
              editedPost.id +
              ".json",
            editedPost
          )
          .then(res => {
            vuexContext.commit("editPost", editedPost);
          })
          .catch(e => console.log(e));
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit("setPosts", posts);
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      }
    }
  });
};

export default createStore;
