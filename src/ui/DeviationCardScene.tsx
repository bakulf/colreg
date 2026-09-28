import type { DeviationCard } from '../core/compass/model.ts';
import { CARD_STEP, bearing, error } from '../core/compass/model.ts';

/** The deviation card, laid out as the one inside a training almanac's cover. */
export function DeviationCardScene({ card }: { card: DeviationCard; compact?: boolean }) {
  const half = card.deviation.length / 2;
  const rows = [card.deviation.slice(0, half), card.deviation.slice(half)];
  return (
    <div className="devcard" role="table" aria-label="Deviation card">
      <div className="devcard-title">Deviation card — steering compass</div>
      <table>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              <th scope="row">
                Ship’s head
                <br />
                Deviation
              </th>
              {row.map((d, i) => (
                <td key={i}>
                  <span className="devcard-head">{bearing((r * half + i) * CARD_STEP)}C</span>
                  <span className="devcard-dev">{error(d)}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
