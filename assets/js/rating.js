(()=>{const t=()=>{document.querySelector(".rating").classList.add("rated")};window.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector(".rating"),a=document.querySelectorAll(".rating__btns-wrapper .star"),{postId:o}=e.dataset;JSON.parse(localStorage.getItem("ratedPosts"))||localStorage.setItem("ratedPosts",JSON.stringify([])),(t=>localStorage.getItem("ratedPosts").includes(t))(o)?t():a.forEach(((e,o)=>{e.addEventListener("mouseenter",(()=>{((t,e)=>{const a=document.querySelector(".rating__progress"),{rating:o}=t.dataset;e.forEach(((t,e)=>{e+1<=o&&t.classList.add("active")})),a.classList.add("d-none")})(e,a)})),e.addEventListener("mouseleave",(()=>{(t=>{const e=document.querySelector(".rating__progress");t.forEach((t=>{t.classList.remove("active")})),e.classList.remove("d-none")})(a)})),e.addEventListener("click",(()=>{(async e=>{const{rating:a}=e.dataset,{postId:o}=e.closest(".rating").dataset,s=document.querySelector(".rating__value"),r=new FormData;r.append("action","recipe_rating"),r.append("rating",a),r.append("postId",o);const n=await fetch(myAjax.ajaxurl,{method:"post",body:r}),d=await n.json();s.innerText=d.toFixed(1),(t=>{const e=JSON.parse(localStorage.getItem("ratedPosts"));e.push(t),localStorage.setItem("ratedPosts",JSON.stringify(e))})(o),(t=>{const e=document.querySelector(".rating__progress"),a=20*t.toFixed(1)/100*104+(4*Math.floor(t)>16?16:4*Math.floor(t));e.style.width=`${a}px`})(d),t()})(e)}))}))}))})();