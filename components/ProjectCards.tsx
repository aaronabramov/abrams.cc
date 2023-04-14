import type * as CSS from 'csstype';
import React from 'react'
import YouTube from 'react-youtube';

const styles: { [key: string]: CSS.Properties } = {
  card: {
    display: 'flex',
    padding: "10px",
    marginTop: "20px",
  },
  logoLink: {
    display: "flex",
    minWidth: "100px",
    minHeight: "100px",
    padding: "0",
    margin: "0",
    alignItems: "center",
  },
  img: {
    height: '100px',
    width: '100px',
  },
  projectTitle: {
    fontSize: "26px",
    fontWeight: 'bold',
    color: "#d52c2c",
  },
  cardText: {
    paddingLeft: "30px"
  },
  a: {
    color: "#d52c2c",
  },
  videoContainer: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    alignItems: "center"
  },
  youtubeCard: {
    padding: '10px 5px'
  },
}

export const ProjectCard: React.FC<React.PropsWithChildren<{ imgSrc: string, src: string, title: string }>> = (props) => {
  return (
    <div style={styles.card}>
      <a style={styles.logoLink} href={props.src} target="_blank">
        <img style={styles.img} src={props.imgSrc} />
      </a>
      <div style={styles.cardText}>
        <a href={props.src} target="_blank"><h1 style={styles.projectTitle}>{props.title}</h1></a>
        {props.children}
      </div>
    </div>
  )
}

export const ProjectsCards = () => {
  return (
    <div>
      <ProjectCard
        imgSrc="/logo_k9.png"
        title="k9 - Rust snapshot testing library"
        src="https://github.com/aaronabramov/k9"
      >
        <p>
          k9 is a Rust testing library that provides simplified
          API for snapshot testing as well as a set of other
          useful assertion helpers focused on producing better
          failing messages
        </p>
      </ProjectCard>
      <ProjectCard
        imgSrc="/logo_jest.png"
        title="Jest - JavaScript testing framework"
        src="https://github.com/facebook/jest"
      >
        <p>
          When I joined Meta, <a href="https://cpojer.net/" style={styles.a} target="_blank">Christoph Nakazawa</a> and
          I worked on improving the testing infrastructure at the company. As part of this effort, we implemented a
          large portion of the core framework functionality of Jest, which later became the most popular testing framework
          in JavaScript.
        </p>
      </ProjectCard >
      <ProjectCard
        imgSrc="/logo_stc.png"
        title="String Tension Calculator"
        src="https://www.stringtensioncalculator.com/"
      >
        <p>
          When I went on tour with my band, I had to bring multiple guitars with me, each in a different tuning.
          To ensure that each guitar had the same string tension, I built a tool that did the math and made
          the process easier.
        </p>
      </ProjectCard >

    </div >
  )
}

export const YoutubeCard = (props: { ytid: string }) => {
  const opts = { height: 390 / 2, width: 640 / 2 }
  return (<div style={styles.youtubeCard}>

    <YouTube opts={opts} videoId={props.ytid} />
  </div>)
}

export const MusicCards = () => {
  return (
    <div style={styles.videoContainer}>
      <YoutubeCard ytid="sXyOhmctdfo" />
      <YoutubeCard ytid="hSfEoGFgpf0" />
      <YoutubeCard ytid="pC14uSCX4YI" />
      <YoutubeCard ytid="GPLw_mULgjY" />
      <YoutubeCard ytid="qegs2Er7T-g" />
      <YoutubeCard ytid="GlYQCBpo8HA" />
    </div>
  )
}

export const FilmCards = () => {
  return (
    <div style={styles.videoContainer}>
      <YoutubeCard ytid="wkk8KV82zH0" />
      <YoutubeCard ytid="6U_TpzUEmHk" />
      <YoutubeCard ytid="78K39b7jPgk" />
      <YoutubeCard ytid="rMAmyulV7cw" />
      <YoutubeCard ytid="9ya2Jb5nUMo" />
      <YoutubeCard ytid="VYUs9bFdAiw" />
    </div>
  )
}
