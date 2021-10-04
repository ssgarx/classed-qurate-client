import { Box } from "@material-ui/core";
import React from "react";
import style from "./greetingScreen.module.scss";
import Swirly_point from "../assets/Swirly_point.png";
import Up_right from "../assets/Up_right.png";
import Curved from "../assets/Curved.png";
import Curved2 from "../assets/Curved2.png";
import Follow from "../assets/Follow.png";
import PointLeft from "../assets/PointLeft.png";
import PointUp from "../assets/PointUp.png";
import PointBottom from "../assets/PointBottom.png";
import UnionB from "../assets/UnionB.png";
function GreetingScreem() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="95vh"
    >
      <div className={style.settings_informer_parent}>
        <div>
          <img src={Swirly_point} alt="" />
        </div>
        <div>Access settings from here ⚙️</div>
      </div>
      <div className={style.exp_search_informer_parent}>
        <div>
          <img src={Up_right} alt="" />
        </div>
        <div>
          Search for any <br /> public folder here 🔎
        </div>
      </div>
      <div className={style.your_folders_informer_parent}>
        <div>
          <img src={Curved} alt="" />
        </div>
        <div>
          <p>your folders will show up here.</p>
          <p>
            we have added 3 of them by default, <br /> you can delete them if u
            want 🤫
          </p>
        </div>
      </div>
      <div className={style.exp_publicfolder_informer_parent}>
        <div>
          <img src={Curved2} alt="img" />
        </div>
        <div>
          popular public folders <br /> will appear here. 🏅
        </div>
      </div>
      <div className={style.follow_informer_parent}>
        <div>
          <div>
            <img className={style.img1} src={Follow} alt="img" />
          </div>
          <div>
            <img className={style.img2} src={PointLeft} alt="img" />
          </div>
          <div>
            <img className={style.img3} src={PointUp} alt="img" />
          </div>
          <div>
            <img className={style.img4} src={PointBottom} alt="img" />
          </div>
          <div>
            <img className={style.img5} src={UnionB} alt="img" />
          </div>
        </div>
        <div>tap on this to follow/unfollow a folder</div>
      </div>
    </Box>
  );
}

export default GreetingScreem;
