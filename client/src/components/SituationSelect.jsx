import React from "react";
import styled from "styled-components";
import { ALL_OPTIONS, getSituation } from "../constants/situations";

const KNOWN = new Set(ALL_OPTIONS.flatMap((g) => g.items.map((s) => s.value)));

const Select = styled.select`
  height: 34px;
  padding: 0 28px 0 10px;
  border: 1px solid var(--border);
  border-left: 4px solid ${({ $color }) => $color};
  border-radius: 8px;
  background: #fff
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2364748b'/%3E%3C/svg%3E")
    no-repeat right 10px center;
  appearance: none;
  font-size: 13px;
  cursor: pointer;
`;

export const SituationSelect = ({ value, onChange, ...rest }) => (
  <Select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    $color={getSituation(value).color}
    {...rest}
  >
    {!KNOWN.has(value) && <option value={value}>{getSituation(value).label}</option>}
    {ALL_OPTIONS.map(({ group, items }) => (
      <optgroup key={group} label={group}>
        {items.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </optgroup>
    ))}
  </Select>
);
