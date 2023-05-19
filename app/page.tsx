"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import TinderCard from "react-tinder-card";
import { Worker } from "./interfaces/Worker";
import styles from "./page.module.css";
import IconButton from "@mui/material/IconButton";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import History from "./components/history";
import Link from "next/link";

type Direction = "left" | "right";

enum Action {
  ACCEPT,
  DECLINE,
}

const Home = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [acceptedWorkers, setAcceptedworkers] = useState<Worker[]>([]);
  const [rejectedWorkers, setRejectedworkers] = useState<Worker[]>([]);
  const [currentIndex, setCurrentIndex] = useState(workers.length - 1);
  const [lastDirection, setLastDirection] = useState<Direction>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      const res = await fetch("http://localhost:3000/api/user/workers");
      const data: Worker[] = await res.json();
      setWorkers(data);
      setCurrentIndex(data.length - 1);
      setLoading(false);
    };

    fetchWorkers();
  }, []);

  const currentIndexRef = useRef(currentIndex);

  const childRefs: any = useMemo(
    () =>
      Array(workers.length)
        .fill(0)
        .map(() => React.createRef<HTMLDivElement>()),
    [workers]
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex >= 0;

  const swiped = (direction: Direction, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const swipe = async (direction: Direction) => {
    if (canSwipe && currentIndex < workers.length) {
      await childRefs[currentIndex].current.swipe(direction);
    }
  };

  const onClickHandler = (worker: Worker, action: Action) => {
    if (action === Action.DECLINE) {
      setRejectedworkers((current) => [...current, worker]);
      swipe("left");
    } else {
      setAcceptedworkers((current) => [...current, worker]);
      swipe("right");
    }
  };

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className={styles.app}>
      <div className={styles.main}>
        {canSwipe ? (
          <>
            <h1>Mission Impossible 3</h1>
            <h2>Position: Stunt Double</h2>
            <div className={styles.cardContainer}>
              {workers.map((worker, index) => (
                <TinderCard
                  ref={childRefs[index]}
                  className={styles.swipe}
                  key={worker.id}
                  onSwipe={(dir) => swiped(dir, index)}
                >
                  <Link href={worker.link} target="_blank">
                    <div
                      style={{ backgroundImage: "url(" + worker.image + ")" }}
                      className={styles.card}
                    >
                      <h4>Click for more info</h4>
                      <h3>{worker.name}</h3>
                    </div>
                  </Link>
                </TinderCard>
              ))}
            </div>
            <div className={styles.buttons}>
              <IconButton
                size="small"
                aria-label="decline"
                onClick={() =>
                  onClickHandler(workers[currentIndex], Action.DECLINE)
                }
              >
                <CancelOutlinedIcon style={{ color: "red" }} />
              </IconButton>
              <IconButton
                size="small"
                aria-label="accept"
                onClick={() =>
                  onClickHandler(workers[currentIndex], Action.ACCEPT)
                }
              >
                <CheckCircleOutlineOutlinedIcon style={{ color: "green" }} />
              </IconButton>
            </div>
          </>
        ) : (
          <h1>There are no more workers to view</h1>
        )}
        <History
          acceptedWorkers={acceptedWorkers}
          rejectedWorkers={rejectedWorkers}
        />
      </div>
    </div>
  );
};

export default Home;
