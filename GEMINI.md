# 代理执行规则 / Agent Execution Rule

- **必须生成执行计划 (Mandatory Execution Plan)**：对于所有对话和用户请求，首先在计划中生成详细的执行计划（在 `implementation_plan.md` 中）。
- **禁止主动询问执行许可 (No Proactive Execution Prompts)**：不要使用 `ask_question` 工具或在回复中询问用户是否要执行该计划。
- **等待用户确认 (Wait for Approval)**：生成计划并呈现给用户后，必须停止并等待用户明确通知（例如：“开始执行”或“计划符合要求，可以执行”），在此之前不要执行任何代码修改或具有副作用的命令。
