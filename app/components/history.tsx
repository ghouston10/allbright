import styles from "../page.module.css";
import { Worker } from "../interfaces/Worker";

interface HistoryProps {
  acceptedWorkers: Worker[];
  rejectedWorkers: Worker[];
}

export const History = (props: HistoryProps) => {
  return (
    <div className={styles.history}>
      <div className={styles.historyNames}>
        <label className={styles.historyLabel}>Rejected</label>
        {props.rejectedWorkers.map((worker) => (
          <label key={worker.id}>{worker.name}</label>
        ))}
      </div>
      <div className={styles.historyNames}>
        <label className={styles.historyLabel}>Accepted</label>
        {props.acceptedWorkers.map((worker) => (
          <label key={worker.id}>{worker.name}</label>
        ))}
      </div>
    </div>
  );
};

export default History;
