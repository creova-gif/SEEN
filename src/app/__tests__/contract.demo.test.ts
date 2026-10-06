import { beforeEach } from "vitest";
import { demoAdapter } from "../services/demo/adapter";
import { setLatency, setSimulation } from "../services/runtime";
import { runContractSuite } from "./contract.shared";

beforeEach(() => { localStorage.clear(); setSimulation("none"); setLatency(0); });
runContractSuite("demo adapter", () => demoAdapter);
