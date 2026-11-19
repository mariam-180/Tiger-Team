export function sortPcs(pcs) {
  return [...pcs].sort((a, b) => Number(a.pc_number) - Number(b.pc_number));
}

export function hasFixedPcLayout(pcs, count) {
  return (
    pcs.length === count &&
    pcs.every((pc, index) => Number(pc.pc_number) === index + 1)
  );
}
